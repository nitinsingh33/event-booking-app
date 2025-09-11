import express from "express";
import { UserService } from "../services/userService.js";
import { generateToken, authenticateToken } from "../utils/auth.js";

const router = express.Router();

// ✅ Signup Route (POST /api/auth/signup)
router.post("/signup", async (req, res) => {
  const { name, email, password, college, studentId, phone } = req.body;

  // Input Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  // Validate email format (basic college email validation)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address." });
  }

  try {
    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // Create user
    const newUser = await UserService.createUser({
      name,
      email,
      password,
      college,
      studentId,
      phone
    });

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

  // Input Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user by email
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Verify password
    const isPasswordValid = await UserService.verifyPassword(password, user.password);
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

// ✅ Get User Profile (GET /api/auth/profile)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UserService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      message: "Profile retrieved successfully",
      user
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Update User Profile (PUT /api/auth/profile)
router.put("/profile", authenticateToken, async (req, res) => {
  const { name, college, studentId, phone } = req.body;

  try {
    const updatedUser = await UserService.updateUser(req.user.id, {
      name,
      college,
      studentId,
      phone
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      message: "Internal server error during profile update",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get User's Event Registrations (GET /api/auth/my-registrations)
router.get("/my-registrations", authenticateToken, async (req, res) => {
  try {
    const registrations = await UserService.getUserRegistrations(req.user.id);
    
    res.json({
      message: "Registrations retrieved successfully",
      registrations
    });

  } catch (error) {
    console.error("Registrations error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Verify Token Route (POST /api/auth/verify)
router.post("/verify", authenticateToken, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user
  });
});

export default router;
