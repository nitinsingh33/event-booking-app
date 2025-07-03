import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();


// ✅ Signup Route (POST /api/auth/signup)
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Input Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Optional: Create JWT (if needed later)
    // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Return response
    res.status(201).json({
      message: "User registered successfully.",
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});


// ✅ Login Route (POST /api/auth/login)
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

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultSecret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;
