// Vercel detects this root entry point as an Express application.
// Keep the existing backend/server.js for persistent local Node hosting.
if (!["production", "PRODUCTION"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: "backend/config/.env" });
}

const express = require("express"); // Explicit framework import for Vercel detection.
const app = require("./backend/app");
const connectDatabase = require("./backend/db/Database");

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Establish a reusable database connection before all application API routes.
// Express executes middleware in registration order, so the proxy wraps app.
const api = express();
api.use(async (req, res, next) => {
  if (req.path === "/api/health") return next();
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});
api.use(app);

module.exports = api;
