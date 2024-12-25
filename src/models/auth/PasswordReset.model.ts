import { Schema, model } from "mongoose";

interface IPasswordReset {
  userId: Schema.Types.ObjectId;
  token: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Tự động xóa tokens hết hạn sau 24h
passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

// Xóa collection cũ nếu tồn tại
model("PasswordReset", passwordResetSchema)
  .collection.drop()
  .catch(() => {
    console.log("Collection does not exist or already dropped");
  });

// Tạo model mới
export const PasswordReset = model<IPasswordReset>(
  "PasswordReset",
  passwordResetSchema
);

// Đảm bảo index được tạo đúng
PasswordReset.init()
  .then(() => {
    console.log("PasswordReset model indexes created");
  })
  .catch((err) => {
    console.error("Error creating PasswordReset model indexes:", err);
  });
