import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./lib/prisma.js";
import authRoute from "./routes/authRoute.js";
import testRoute from "./routes/testRoute.js";
import eventRoute from "./routes/eventRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARE (must be before routes)
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); // JSON parser

// ✅ Debug log to confirm it's working
app.use((req, res, next) => {
  console.log(`🔥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ✅ ROUTES
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/event", eventRoute);

// ✅ Health check route
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: "OK", 
      database: "Connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      database: "Disconnected",
      error: error.message 
    });
  }
});

// ✅ DATABASE + SERVER
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ PostgreSQL connected successfully");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
