import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

export default router;
