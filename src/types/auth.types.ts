import { Document, Model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "admin" | "editor";
}

export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export type UserDocument = Document & IUser & IUserMethods;

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface UserInput extends Omit<IUser, "role" | "_id"> {
  role?: "admin" | "editor";
}
