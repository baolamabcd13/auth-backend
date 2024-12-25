import { UserDocument, UserInput } from "../../types/auth.types";
import { User } from "../../models/auth/User.model";
import { AppError } from "../../utils/appError";
import logger from "../../utils/logger";

export const findUserById = async (
  id: string
): Promise<UserDocument | null> => {
  try {
    return (await User.findById(id).select("-password")) as UserDocument | null;
  } catch (error) {
    logger.error("Error finding user by id:", error);
    throw new AppError("Error finding user", 500);
  }
};

export const findUserByUsername = async (
  username: string
): Promise<UserDocument | null> => {
  try {
    return (await User.findOne({ username })) as UserDocument | null;
  } catch (error) {
    logger.error("Error finding user by username:", error);
    throw new AppError("Error finding user", 500);
  }
};

export const createUser = async (
  userData: UserInput
): Promise<UserDocument> => {
  try {
    return (await User.create(userData)) as UserDocument;
  } catch (error) {
    logger.error("Error creating user:", error);
    throw new AppError("Error creating user", 500);
  }
};
