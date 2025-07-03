import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARE (must be before routes)
app.use(cors());
app.use(express.json()); // JSON parser

// ✅ Debug log to confirm it's working
app.use((req, res, next) => {
  console.log("🔥 Middleware Hit");
  next();
});

// ✅ ROUTES
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);

// ✅ DATABASE + SERVER
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log("❌ DB Error:", err.message));
