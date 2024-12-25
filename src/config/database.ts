import mongoose from "mongoose";
import dotenv from "dotenv";
import { AppError } from "../utils/errors";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new AppError(
        "MONGODB_URI is not defined in environment variables",
        500
      );
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};
