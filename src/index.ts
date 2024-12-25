import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import { requestLogger } from "./middleware/logger.middleware";
import logger from "./utils/logger";
import adminRoutes from "./routes/admin.routes";
import { globalLimiter } from "./middleware/rateLimiter.middleware";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// Apply global rate limiting
app.use(globalLimiter);

// Health check route - đặt TRƯỚC các routes khác
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 4000;

// Improved error handling for server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on("error", (error: Error) => {
  logger.error("Server error:", error);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    logger.info("Process terminated");
  });
});

// Database connection with better error handling
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/auth-db")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (error: Error) => {
  logger.error("Unhandled Rejection:", error);
  server.close(() => {
    process.exit(1);
  });
});
