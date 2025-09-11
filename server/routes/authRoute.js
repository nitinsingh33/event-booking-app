import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// Get database connection from app locals
const getDb = (req) => req.app.locals.db;

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Signup Route (POST /api/auth/signup)
router.post("/signup", async (req, res) => {
  const { name, email, password, college, studentId, phone } = req.body;
  const db = getDb(req);

  // Input Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  try {
    // Check if user already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.query(`
      INSERT INTO users (name, email, password, college, student_id, phone) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id, name, email, college, student_id, phone, role, created_at
    `, [name, email, hashedPassword, college, studentId, phone]);

    const newUser = result.rows[0];

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      message: "Account created successfully!",
      user: newUser,
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      message: "Internal server error during signup",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Login Route (POST /api/auth/login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = getDb(req);

  // Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user by email
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful!",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Internal server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Simple test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

export default router;
