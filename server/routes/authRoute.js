import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

router.post("/check", (req, res) => {
  console.log("Check route body:", req.body);
  res.send("Check route hit");
});


router.post("/register", async (req, res) => {
    console.log(" req.body:", req.body); 
    const { name, email, password } = req.body;

    // Validate
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

export default router;