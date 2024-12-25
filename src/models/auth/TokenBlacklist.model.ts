import mongoose from "mongoose";

interface ITokenBlacklist extends mongoose.Document {
  token: string;
  createdAt: Date;
}

const tokenBlacklistSchema = new mongoose.Schema({
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

const TokenBlacklist = mongoose.model<ITokenBlacklist>(
  "TokenBlacklist",
  tokenBlacklistSchema
);

export default TokenBlacklist;
