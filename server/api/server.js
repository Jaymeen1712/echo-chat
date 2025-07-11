require("dotenv").config();
const { createServer } = require("node:http");
const Cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const router = require("../routes/routes");
const SocketManager = require("../utils/socketManager");
const {
  createIndexes,
  monitorConnectionPool,
  monitorMemoryUsage,
} = require("../utils/dbOptimization");

// Import middleware
const { generalLimiter } = require("../middleware/rateLimitMiddleware");
const {
  securityHeaders,
  compressionMiddleware,
  loggingMiddleware,
  sanitizeRequest,
  requestSizeLimit,
  corsOptions,
} = require("../middleware/securityMiddleware");

const port = process.env.PORT || 4000;

const app = express();
const server = createServer(app);

// Database connection with optimized settings
mongoose.connect(process.env.DATABASE_URL, {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.once("open", async () => {
  console.log("Database Connection Established!");

  // Create database indexes for better performance
  await createIndexes();

  // Start monitoring in development
  if (process.env.NODE_ENV === "development") {
    monitorConnectionPool();
    monitorMemoryUsage();
  }
});

// Apply security and performance middleware
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(loggingMiddleware);
app.use(generalLimiter);
app.use(requestSizeLimit);
app.use(sanitizeRequest);

// Body parsing middleware with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS with enhanced configuration
app.use(Cors(corsOptions));

// Routes
app.use("/chat-service", router);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: isDevelopment ? err.message : "Internal server error",
    ...(isDevelopment && { stack: err.stack }),
  });
});

// Initialize Socket.io with optimized configuration
const socketManager = new SocketManager(server);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  socketManager.cleanup();
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  socketManager.cleanup();
  server.close(() => {
    console.log("Process terminated");
  });
});
