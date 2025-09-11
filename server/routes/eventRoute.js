import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

// Get database connection from app locals
const getDb = (req) => req.app.locals.db;

// ✅ Get All Events (GET /api/event)
router.get("/", async (req, res) => {
  const db = getDb(req);
  
  try {
    const { type, search } = req.query;
    
    let query = 'SELECT * FROM events WHERE is_active = true';
    let params = [];
    
    if (type) {
      query += ' AND event_type = $1';
      params.push(type.toUpperCase());
    }
    
    if (search) {
      const searchIndex = params.length + 1;
      query += ` AND (name ILIKE $${searchIndex} OR description ILIKE $${searchIndex} OR location ILIKE $${searchIndex})`;
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY date ASC';
    
    const result = await db.query(query, params);

    res.json({
      message: "Events retrieved successfully",
      events: result.rows
    });

  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Event by ID (GET /api/event/:id)
router.get("/:id", async (req, res) => {
  const db = getDb(req);
  
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // Get event details
    const eventResult = await db.query(`
      SELECT 
        id,
        name as title,
        description,
        event_type as type,
        date,
        location,
        max_seats as "maxSeats",
        available_seats as "availableSeats",
        registration_fee as fee,
        is_active,
        created_at
      FROM events 
      WHERE id = $1 AND is_active = true
    `, [eventId]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];

    // Get time slots for this event
    const timeSlotsResult = await db.query(`
      SELECT 
        id,
        start_time,
        end_time,
        max_seats,
        available_seats
      FROM time_slots 
      WHERE event_id = $1 
      ORDER BY start_time ASC
    `, [eventId]);

    res.json({
      message: "Event retrieved successfully",
      event,
      timeSlots: timeSlotsResult.rows
    });

  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Register for Event with JWT Authentication (POST /api/events/register)
router.post("/register", verifyToken, async (req, res) => {
  const db = getDb(req);
  
  try {
    const { eventId, timeSlotId } = req.body;
    const userId = req.user.userId;
    
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Start transaction
    await db.query('BEGIN');

    try {
      // Get user details
      const userResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      const user = userResult.rows[0];

      // Get event details
      const eventResult = await db.query('SELECT * FROM events WHERE id = $1 AND is_active = true', [eventId]);
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found or inactive');
      }
      const event = eventResult.rows[0];

      // Check if user is already registered for this event
      const existingRegistration = await db.query(
        'SELECT * FROM event_registrations WHERE event_id = $1 AND user_id = $2',
        [eventId, userId]
      );
      
      if (existingRegistration.rows.length > 0) {
        throw new Error('You are already registered for this event');
      }

      // Check and update seats
      if (timeSlotId) {
        // Time slot specific registration
        const slotResult = await db.query(
          'SELECT * FROM time_slots WHERE id = $1 AND event_id = $2',
          [timeSlotId, eventId]
        );
        
        if (slotResult.rows.length === 0) {
          throw new Error('Time slot not found');
        }
        
        const slot = slotResult.rows[0];
        if (slot.available_seats <= 0) {
          throw new Error('No seats available for this time slot');
        }
        
        // Update time slot seats
        await db.query(
          'UPDATE time_slots SET available_seats = available_seats - 1 WHERE id = $1',
          [timeSlotId]
        );
      } else {
        // Regular event registration
        if (event.available_seats <= 0) {
          throw new Error('No seats available for this event');
        }
        
        // Update event seats
        await db.query(
          'UPDATE events SET available_seats = available_seats - 1 WHERE id = $1',
          [eventId]
        );
      }

      // Generate ticket code
      const ticketCode = `TKT-${eventId}-${userId}-${Date.now()}`;

      // Create registration record
      const registrationResult = await db.query(`
        INSERT INTO event_registrations 
        (event_id, user_id, time_slot_id, full_name, email, phone, college, ticket_code, registration_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        RETURNING *
      `, [
        eventId,
        userId,
        timeSlotId || null,
        user.name,
        user.email,
        user.phone || '',
        user.college || '',
        ticketCode
      ]);

      // Commit transaction
      await db.query('COMMIT');

      res.status(201).json({
        message: "Registration successful!",
        ticketId: ticketCode,
        registration: registrationResult.rows[0]
      });

    } catch (error) {
      // Rollback transaction
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ 
      message: error.message || "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Register for Event (POST /api/event/:id/register)
router.post("/:id/register", async (req, res) => {
  const db = getDb(req);
  
  try {
    const eventId = parseInt(req.params.id);
    const { fullName, email, phone, college, seats, comments } = req.body;

    console.log("📥 Event Registration Request:", {
      eventId,
      fullName,
      email,
      phone,
      college,
      seats
    });

    // Validation
    if (!fullName || !email || !phone || !college || !seats) {
      return res.status(400).json({ 
        message: "Required fields: fullName, email, phone, college, seats" 
      });
    }

    if (isNaN(eventId) || seats < 1) {
      return res.status(400).json({ message: "Invalid event ID or seat count" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if event exists and has available seats
    const eventResult = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
    
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult.rows[0];
    
    if (event.available_seats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Generate unique ticket code
    const ticketCode = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Start transaction
    await db.query('BEGIN');

    try {
      // Create registration
      const registrationResult = await db.query(`
        INSERT INTO event_registrations (event_id, full_name, email, phone, college, seats, comments, ticket_code) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `, [eventId, fullName, email, phone, college, seats, comments, ticketCode]);

      // Update available seats
      await db.query(
        'UPDATE events SET available_seats = available_seats - $1 WHERE id = $2',
        [seats, eventId]
      );

      await db.query('COMMIT');

      const registration = registrationResult.rows[0];

      res.status(201).json({
        message: "Registration successful! Your ticket has been generated.",
        registration,
        ticketCode: registration.ticket_code
      });

    } catch (error) {
      await db.query('ROLLBACK');
      throw error;
    }

  } catch (error) {
    console.error("Event registration error:", error);
    res.status(400).json({ 
      message: error.message || "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Registration by Ticket Code (GET /api/event/ticket/:ticketCode)
router.get("/ticket/:ticketCode", async (req, res) => {
  const db = getDb(req);
  
  try {
    const { ticketCode } = req.params;
    
    const result = await db.query(`
      SELECT er.*, e.name as event_name, e.date, e.start_time, e.end_time, e.location 
      FROM event_registrations er 
      JOIN events e ON er.event_id = e.id 
      WHERE er.ticket_code = $1
    `, [ticketCode]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const registration = result.rows[0];

    res.json({
      message: "Ticket retrieved successfully",
      registration
    });

  } catch (error) {
    console.error("Get ticket error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Event Types (GET /api/event/meta/types)
router.get("/meta/types", (req, res) => {
  const eventTypes = [
    'WORKSHOP',
    'SEMINAR', 
    'CULTURAL',
    'SPORTS',
    'TECHNICAL',
    'MEETUP',
    'CONFERENCE',
    'OTHER'
  ];
  
  res.json({
    message: "Event types retrieved successfully",
    eventTypes
  });
});

export default router;
