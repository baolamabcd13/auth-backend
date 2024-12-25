import { UserDocument, UserInput } from "../types/auth.types";
import { User } from "../models/auth/User.model";
import logger from "../utils/logger";

export const isFirstUser = async (): Promise<boolean> => {
  try {
    const count = await User.countDocuments();
    return count === 0;
  } catch (error) {
    logger.error("Error checking first user:", error);
    return false;
  }
};

export const findAllUsers = async (): Promise<UserDocument[]> => {
  try {
    return (await User.find().select("-password")) as UserDocument[];
  } catch (error) {
    logger.error("Error finding all users:", error);
    return [];
  }
};

export const updateUser = async (
  userId: string,
  updateData: Partial<UserInput>
): Promise<UserDocument | null> => {
  try {
    return (await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")) as UserDocument | null;
  } catch (error) {
    logger.error("Error updating user:", error);
    return null;
  }
};
