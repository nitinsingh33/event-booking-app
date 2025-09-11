import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Get database connection from app locals
const getDb = (req) => req.app.locals.db;

// Professional User Activity Logging
const logUserActivity = async (db, userId, activityType, description, entityType = null, entityId = null) => {
  try {
    await db.query(`
      INSERT INTO user_activity_logs (user_id, activity_type, activity_description, entity_type, entity_id)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, activityType, description, entityType, entityId]);
  } catch (error) {
    // If activity log table doesn't exist, just log and continue
    console.log('Activity logging not available:', error.message);
  }
};

// Generate comprehensive JWT token
const generateToken = (user) => {
  return jwt.sign({
    userId: user.id,
    email: user.email,
    name: user.name,
    college: user.college,
    department: user.department,
    year: user.year
  }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// Comprehensive input validation for current schema
const validateUserInput = (userData) => {
  const { name, email, password, phone, college } = userData;
  
  if (!name || name.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please provide a valid email address');
  }
  
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/[^\d]/g, ''))) {
    throw new Error('Please provide a valid 10-digit phone number');
  }
  
  if (!college || college.length < 3) {
    throw new Error('College name must be at least 3 characters long');
  }
};

// ✅ Professional User Signup
router.post("/signup", async (req, res) => {
  const db = getDb(req);
  
  try {
    const { name, email, password, phone, college, rollNumber, department, year } = req.body;

    console.log("📥 Professional Signup Request:", { 
      name, email, phone, college, rollNumber, department, year 
    });

    // Comprehensive validation
    validateUserInput(req.body);

    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        message: "A user with this email already exists. Please use a different email or try logging in." 
      });
    }

    // Hash password with high security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create student ID from available data
    const studentId = rollNumber || `${department || 'GEN'}/${year || 1}/2024`;

    // Create user with current schema
    const result = await db.query(`
      INSERT INTO users (
        name, email, password, phone, college, student_id, role, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'STUDENT', CURRENT_TIMESTAMP)
      RETURNING id, name, email, phone, college, student_id, role, created_at
    `, [name, email, hashedPassword, phone, college, studentId]);

    const user = result.rows[0];

    // Log user registration activity
    await logUserActivity(db, user.id, 'user_registration', 'New user account created', 'user', user.id);

    // Generate comprehensive JWT token
    const token = generateToken(user);

    console.log("✅ Professional user created successfully:", user.id);

    res.status(201).json({
      message: "Welcome! Your account has been created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        studentId: user.student_id,
        role: user.role,
        joinedAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error("Professional signup error:", error);
    
    // Return user-friendly error messages
    if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
      return res.status(409).json({ 
        message: "An account with this email already exists. Please try logging in instead." 
      });
    }
    
    res.status(400).json({ 
      message: error.message || "Registration failed. Please check your information and try again."
    });
  }
});

// ✅ Professional User Login with Security Tracking
router.post("/login", async (req, res) => {
  const db = getDb(req);
  
  try {
    const { email, password } = req.body;

    console.log("📥 Professional Login Request:", { email });

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide both email and password." 
      });
    }

    // Find user with comprehensive data
    const result = await db.query(`
      SELECT id, name, email, password, phone, college, student_id, role, created_at
      FROM users 
      WHERE email = $1
    `, [email]);

    if (result.rows.length === 0) {
      await logUserActivity(db, null, 'login_failed', `Failed login attempt for ${email}`, 'user', null);
      return res.status(401).json({ 
        message: "Invalid email or password. Please check your credentials and try again." 
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await logUserActivity(db, user.id, 'login_failed', 'Invalid password attempt', 'user', user.id);
      
      return res.status(401).json({ 
        message: "Invalid email or password. Please check your credentials and try again." 
      });
    }

    // Generate comprehensive JWT token
    const token = generateToken(user);

    // Log successful login
    await logUserActivity(db, user.id, 'login_success', 'User logged in successfully', 'user', user.id);

    // Remove sensitive data from response
    const { password: _, ...safeUser } = user;

    console.log("✅ Professional user logged in successfully:", user.id);

    res.json({
      message: `Welcome back, ${user.name}!`,
      user: {
        id: safeUser.id,
        name: safeUser.name,
        email: safeUser.email,
        college: safeUser.college,
        studentId: safeUser.student_id,
        role: safeUser.role,
        memberSince: safeUser.created_at
      },
      token
    });

  } catch (error) {
    console.error("Professional login error:", error);
    res.status(500).json({ 
      message: "Login service is temporarily unavailable. Please try again in a moment.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get User Profile (Protected Route)
router.get("/profile", async (req, res) => {
  const db = getDb(req);
  
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Please log in to continue.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const result = await db.query(`
      SELECT id, name, email, phone, college, department, year,
             is_verified, last_login_at, login_count, created_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `, [decoded.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    const user = result.rows[0];

    // Get recent activity if available
    let recentActivity = [];
    try {
      const activityResult = await db.query(`
        SELECT activity_type, activity_description, created_at
        FROM user_activity_logs 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 10
      `, [decoded.userId]);
      recentActivity = activityResult.rows;
    } catch (error) {
      console.log('Activity logs not available');
    }

    res.json({
      message: "Profile retrieved successfully",
      user,
      recentActivity,
      accountStats: {
        memberSince: user.created_at,
        totalLogins: user.login_count,
        lastLogin: user.last_login_at,
        accountVerified: user.is_verified
      }
    });

  } catch (error) {
    console.error("Profile retrieval error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }
    res.status(500).json({ 
      message: "Failed to retrieve profile information." 
    });
  }
});

// ✅ Health check route
router.get("/health", (req, res) => {
  res.json({ 
    message: "Professional authentication service is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

export default router;
