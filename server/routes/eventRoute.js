import express from "express";
import EventRegistration from "../models/EventRegistration.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("📥 Incoming Event Registration:", req.body);

    const { fullName, email, phone, eventName, date, timeSlot, college, seats, comments } = req.body;

    // Basic Validation
    if (!fullName || !email || !phone || !eventName || !date || !college || !seats ) {
        return res.status(400).json({ message: "All required fields must be filled." });
    }

    try {
        const newEvent = new EventRegistration({
            fullName,
            email,
            phone,
            eventName,
            date,
            timeSlot,
            college,
            seats,
            comments,
        });

        await newEvent.save();
        res.status(201).json({ message: "Event registered successfully." });
    } catch (err) {
        console.error("❌ Event Registration Error:", err);
        res.status(500).json({ message: "Server error while registering event. "});
    }
});

export default router;