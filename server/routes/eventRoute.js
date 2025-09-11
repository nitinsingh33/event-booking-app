import express from "express";
import { EventService } from "../services/eventService.js";
import { authenticateToken, requireOrganizer } from "../utils/auth.js";

const router = express.Router();

// ✅ Get All Events (GET /api/event)
router.get("/", async (req, res) => {
  try {
    const { type, search } = req.query;
    
    let events;
    if (search) {
      events = await EventService.searchEvents(search);
    } else if (type) {
      events = await EventService.getEventsByType(type.toUpperCase());
    } else {
      events = await EventService.getAllEvents();
    }

    res.json({
      message: "Events retrieved successfully",
      events
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
  try {
    const eventId = parseInt(req.params.id);
    
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const event = await EventService.getEventById(eventId);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event retrieved successfully",
      event
    });

  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Create Event (POST /api/event) - Admin/Organizer only
router.post("/", authenticateToken, requireOrganizer, async (req, res) => {
  try {
    const {
      name,
      description,
      eventType,
      date,
      startTime,
      endTime,
      location,
      maxSeats,
      registrationFee,
      organizerName,
      organizerContact,
      imageUrl,
      requirements,
      timeSlots
    } = req.body;

    // Validation
    if (!name || !eventType || !date || !startTime || !endTime || !location || !organizerName || !organizerContact) {
      return res.status(400).json({ 
        message: "Required fields: name, eventType, date, startTime, endTime, location, organizerName, organizerContact" 
      });
    }

    const event = await EventService.createEvent({
      name,
      description,
      eventType: eventType.toUpperCase(),
      date: new Date(date),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
      maxSeats: maxSeats || 100,
      availableSeats: maxSeats || 100,
      registrationFee: registrationFee || 0,
      organizerName,
      organizerContact,
      imageUrl,
      requirements,
      timeSlots
    });

    res.status(201).json({
      message: "Event created successfully",
      event
    });

  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ 
      message: "Internal server error during event creation",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Register for Event (POST /api/event/:id/register)
router.post("/:id/register", async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const { fullName, email, phone, college, seats, timeSlotId, comments, userId } = req.body;

    console.log("📥 Event Registration Request:", {
      eventId,
      fullName,
      email,
      phone,
      college,
      seats,
      timeSlotId,
      userId
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

    const registration = await EventService.registerForEvent({
      eventId,
      userId: userId || null, // Optional for guest registrations
      timeSlotId: timeSlotId || null,
      fullName,
      email,
      phone,
      college,
      seats,
      comments
    });

    res.status(201).json({
      message: "Registration successful! Your ticket has been generated.",
      registration,
      ticketCode: registration.ticketCode
    });

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
  try {
    const { ticketCode } = req.params;
    
    const registration = await EventService.getRegistrationByTicket(ticketCode);
    
    if (!registration) {
      return res.status(404).json({ message: "Ticket not found" });
    }

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

// ✅ Cancel Registration (DELETE /api/event/registration/:id)
router.delete("/registration/:id", authenticateToken, async (req, res) => {
  try {
    const registrationId = parseInt(req.params.id);
    
    if (isNaN(registrationId)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const cancelledRegistration = await EventService.cancelRegistration(registrationId);

    res.json({
      message: "Registration cancelled successfully",
      registration: cancelledRegistration
    });

  } catch (error) {
    console.error("Cancel registration error:", error);
    res.status(400).json({ 
      message: error.message || "Cancellation failed",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Event Types (GET /api/event/types)
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