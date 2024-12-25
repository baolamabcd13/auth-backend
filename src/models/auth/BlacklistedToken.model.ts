import { Schema, model } from "mongoose";

interface IBlacklistedToken {
  token: string;
  createdAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 24 * 60 * 60, // Tự động xóa sau 7 ngày
  },
});

export const BlacklistedToken = model<IBlacklistedToken>(
  "BlacklistedToken",
  blacklistedTokenSchema
);
