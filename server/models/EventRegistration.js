import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    eventName: { type: String, required: true },
    timeSlot: { type: String },
    college: { type: String, required: true },
    seats: { type: Number, required: true },
    comments: { type: String},
}, { timestamps: true });

export default mongoose.model("EventRegistration", eventSchema);