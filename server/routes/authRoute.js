import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Health check route (optional but useful)
router.post("/check", (req, res) => {
  console.log("Check route body:", req.body);
  res.send("Check route hit");
});

// User registration route
router.post("/register", async (req, res) => {
    console.log(" req.body:", req.body); 
    const { name, email, password } = req.body;

    // Input Validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required."});
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered. "});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 👉 Dummy success response
  res.status(201).json({
    id: Date.now(),
    name,
    email,
    token: 'dummy-jwt-token'
  });
});

// 🔐 Login Route - ADD THIS
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});


export default router;