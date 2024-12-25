import { InviteCode, IInviteCode } from "../../models/auth/InviteCode.model";
import {
  PasswordReset,
  IPasswordReset,
} from "../../models/auth/PasswordReset.model";
import { User } from "../../models/auth/User.model";
import { AppError } from "../../utils/errors";

class CodeService {
  // Tạo invite code
  async createInviteCode(adminId: string): Promise<IInviteCode> {
    const code = this.generateRandomCode();

    return await InviteCode.create({
      code,
      createdBy: adminId,
    });
  }

  // Lấy danh sách invite codes
  async getInviteCodes(): Promise<IInviteCode[]> {
    return await InviteCode.find()
      .populate("createdBy", "username")
      .sort("-createdAt");
  }

  // Tạo reset password code
  async createResetCode(
    adminId: string,
    username: string
  ): Promise<IPasswordReset> {
    const user = await User.findOne({ username });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const resetCode = this.generateRandomCode();

    return await PasswordReset.create({
      resetCode,
      userId: user._id,
      createdBy: adminId,
    });
  }

  // Vô hiệu hóa code
  async invalidateCode(
    code: string,
    type: "invite" | "reset"
  ): Promise<IInviteCode | IPasswordReset> {
    let result;

    if (type === "invite") {
      result = await InviteCode.findOneAndUpdate({ code }, { isUsed: true });
    } else {
      result = await PasswordReset.findOneAndUpdate(
        { resetCode: code },
        { isUsed: true }
      );
    }

    if (!result) {
      throw new AppError("Code not found", 404);
    }

    return result;
  }

  // Helper để tạo mã ngẫu nhiên
  private generateRandomCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}

export default new CodeService();
