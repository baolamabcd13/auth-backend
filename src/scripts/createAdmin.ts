import mongoose from "mongoose";
import { User } from "../models/auth/User.model";
import config from "../config";

const createAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    const admin = await User.create({
      username: "admin",
      password: "Admin123456",
      role: "admin",
    });

    console.log("Admin created:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmin();
