// Professional User Service for Enterprise-level Event Management
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserService {
  constructor(dbPool) {
    this.db = dbPool;
  }

  // Professional user registration with comprehensive validation
  async registerUser(userData) {
    const {
      name,
      email,
      password,
      phone,
      college,
      department,
      year,
      rollNumber,
      dateOfBirth,
      gender,
      address
    } = userData;

    try {
      // Comprehensive validation
      this.validateUserData(userData);

      // Check if user already exists
      const existingUser = await this.db.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password securely
      const passwordHash = await bcrypt.hash(password, 12);

      // Split name for professional records
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Insert user with comprehensive data
      const result = await this.db.query(`
        INSERT INTO users (
          name, email, password, phone, college, department, year,
          is_verified, is_active, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, true, CURRENT_TIMESTAMP)
        RETURNING id, name, email, college, department, year, created_at
      `, [name, email, passwordHash, phone, college, department, year]);

      const user = result.rows[0];

      // Log user registration activity
      await this.logUserActivity(user.id, 'user_registration', 'User account created', 'user', user.id);

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token
      };

    } catch (error) {
      console.error('User registration error:', error);
      throw error;
    }
  }

  // Professional login with security tracking
  async loginUser(email, password, deviceInfo = {}) {
    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email]
      );

      if (result.rows.length === 0) {
        // Log failed login attempt
        await this.logUserActivity(null, 'login_failed', `Failed login attempt for ${email}`, 'user', null);
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Check if account is locked
      if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        // Increment failed login attempts
        await this.handleFailedLogin(user.id);
        throw new Error('Invalid email or password');
      }

      // Successful login - reset failed attempts and update login stats
      await this.handleSuccessfulLogin(user.id);

      // Generate JWT token
      const token = this.generateToken(user);

      // Create session record for security tracking
      await this.createUserSession(user.id, token, deviceInfo);

      // Log successful login
      await this.logUserActivity(user.id, 'login_success', 'User logged in successfully', 'user', user.id);

      return {
        user: this.sanitizeUser(user),
        token
      };

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Professional user profile management
  async getUserProfile(userId) {
    try {
      const result = await this.db.query(`
        SELECT 
          id, name, email, phone, college, department, year,
          is_verified, last_login_at, login_count, created_at
        FROM users 
        WHERE id = $1 AND is_active = true
      `, [userId]);

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user activity history for professional tracking
  async getUserActivity(userId, limit = 50) {
    try {
      const result = await this.db.query(`
        SELECT activity_type, activity_description, created_at
        FROM user_activity_logs 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `, [userId, limit]);

      return result.rows;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  }

  // Professional event registration tracking
  async registerUserForEvent(userId, eventId, timeSlotId = null) {
    try {
      // Start transaction for data consistency
      await this.db.query('BEGIN');

      // Get user details
      const userResult = await this.db.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }
      const user = userResult.rows[0];

      // Get event details
      const eventResult = await this.db.query('SELECT * FROM events WHERE id = $1 AND is_active = true', [eventId]);
      if (eventResult.rows.length === 0) {
        throw new Error('Event not found or inactive');
      }
      const event = eventResult.rows[0];

      // Check if already registered
      const existingReg = await this.db.query(
        'SELECT id FROM event_registrations WHERE event_id = $1 AND user_id = $2',
        [eventId, userId]
      );

      if (existingReg.rows.length > 0) {
        throw new Error('You are already registered for this event');
      }

      // Check seat availability
      if (event.available_seats <= 0) {
        throw new Error('No seats available for this event');
      }

      // Generate professional ticket code
      const ticketCode = this.generateTicketCode(eventId, userId);

      // Create registration with professional tracking
      const registrationResult = await this.db.query(`
        INSERT INTO event_registrations (
          event_id, user_id, time_slot_id, full_name, email, phone, 
          college, ticket_code, registration_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        RETURNING *
      `, [
        eventId, userId, timeSlotId, user.name, user.email, 
        user.phone || '', user.college || '', ticketCode
      ]);

      // Update available seats
      await this.db.query(
        'UPDATE events SET available_seats = available_seats - 1 WHERE id = $1',
        [eventId]
      );

      // Commit transaction
      await this.db.query('COMMIT');

      // Log registration activity
      await this.logUserActivity(
        userId, 
        'event_registration', 
        `Registered for event: ${event.name}`, 
        'event', 
        eventId
      );

      return {
        registration: registrationResult.rows[0],
        ticketCode
      };

    } catch (error) {
      // Rollback on error
      await this.db.query('ROLLBACK');
      throw error;
    }
  }

  // Helper methods for professional user management

  validateUserData(userData) {
    const { name, email, password, phone, college, department, year } = userData;

    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (!email || !this.isValidEmail(email)) {
      throw new Error('Please provide a valid email address');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!phone || !this.isValidPhone(phone)) {
      throw new Error('Please provide a valid phone number');
    }

    if (!college || college.length < 3) {
      throw new Error('College name must be at least 3 characters long');
    }

    if (!department || department.length < 2) {
      throw new Error('Department is required');
    }

    if (!year || year < 1 || year > 6) {
      throw new Error('Year must be between 1 and 6');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone.replace(/[^\d]/g, ''));
  }

  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        college: user.college 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  generateTicketCode(eventId, userId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TKT-${eventId}-${userId}-${random}-${timestamp}`;
  }

  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async handleFailedLogin(userId) {
    await this.db.query(`
      UPDATE users 
      SET failed_login_attempts = failed_login_attempts + 1,
          account_locked_until = CASE 
            WHEN failed_login_attempts >= 4 THEN CURRENT_TIMESTAMP + INTERVAL '30 minutes'
            ELSE account_locked_until
          END
      WHERE id = $1
    `, [userId]);
  }

  async handleSuccessfulLogin(userId) {
    await this.db.query(`
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP,
          login_count = login_count + 1,
          failed_login_attempts = 0,
          account_locked_until = NULL
      WHERE id = $1
    `, [userId]);
  }

  async createUserSession(userId, token, deviceInfo) {
    try {
      // Create session record if tables exist
      await this.db.query(`
        INSERT INTO user_sessions (user_id, token_hash, device_info, expires_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP + INTERVAL '7 days')
      `, [userId, this.hashToken(token), JSON.stringify(deviceInfo) || '{}']);
    } catch (error) {
      // If session table doesn't exist, just log and continue
      console.log('Session tracking not available:', error.message);
    }
  }

  async logUserActivity(userId, activityType, description, entityType = null, entityId = null) {
    try {
      await this.db.query(`
        INSERT INTO user_activity_logs (user_id, activity_type, activity_description, entity_type, entity_id)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, activityType, description, entityType, entityId]);
    } catch (error) {
      // If activity log table doesn't exist, just log and continue
      console.log('Activity logging not available:', error.message);
    }
  }

  hashToken(token) {
    return jwt.sign({ token }, process.env.JWT_SECRET || 'your-secret-key');
  }
}

export default UserService;
