import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pkg from 'pg';
const { Pool } = pkg;

// Import routes (enhanced for professional use)
import authRoute from "./routes/authRouteProfessional.js";
import testRoute from "./routes/testRoute.js";
import eventRoute from "./routes/eventRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'college_events_db',
  user: 'college_app_user',
  password: 'nitinsingh',
});

// Make database available to routes
app.locals.db = pool;

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
    const result = await pool.query('SELECT NOW() as current_time, COUNT(*) as user_count FROM users');
    res.json({ 
      status: "OK", 
      database: "Connected",
      timestamp: result.rows[0].current_time,
      users: result.rows[0].user_count
    });
  } catch (error) {
    res.status(500).json({ 
      status: "Error", 
      database: "Disconnected",
      error: error.message 
    });
  }
});

// ✅ Simple test endpoints
app.get("/api/events", async (req, res) => {
  try {
    const events = await pool.query('SELECT * FROM events ORDER BY date ASC');
    res.json({
      message: "Events retrieved successfully",
      events: events.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, college, role, created_at FROM users');
    res.json({
      message: "Users retrieved successfully", 
      users: users.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ DATABASE + SERVER
async function startServer() {
  try {
    // Test database connection
    await pool.query('SELECT 1');
    console.log("✅ PostgreSQL connected successfully");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🎉 Events API: http://localhost:${PORT}/api/events`);
      console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏹️  Shutting down server...');
  await pool.end();
  process.exit(0);
});

startServer();
