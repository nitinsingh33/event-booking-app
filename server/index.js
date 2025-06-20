import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import testRoute from "./routes/testRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/test", testRoute);

// Connect DB + Start Server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
    })
    .catch((err) => console.log("DB Error:", err.message));