// Vercel entry point for the API; the local persistent server remains backend/server.js.
if (!["production", "PRODUCTION"].includes(process.env.NODE_ENV)) {
  require("dotenv").config({ path: "backend/config/.env" });
}

const express = require("express");
const app = require("./backend/app");
const connectDatabase = require("./backend/db/Database");

const api = express();

api.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

api.use(async (_req, res, next) => {
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
