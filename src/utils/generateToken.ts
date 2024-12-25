import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (userId: Types.ObjectId): string => {
  const secret = process.env.JWT_SECRET || "your-default-secret";

  // Log for debugging
  console.log("Generating token for user:", userId);

  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: "30d",
  });

  return token;
};
