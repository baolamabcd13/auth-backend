export interface IUser {
  _id: string;
  username: string;
  password: string;
  role: "admin" | "editor";
  createdAt: Date;
  updatedAt: Date;
}

export interface IInviteCode {
  _id: string;
  code: string;
  isUsed: boolean;
  createdBy: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IPasswordReset {
  _id: string;
  resetCode: string;
  userId: string;
  isUsed: boolean;
  createdBy: string;
  expiresAt: Date;
  createdAt: Date;
}

// Request extension để sử dụng với Express
export interface AuthRequest extends Request {
  user?: IUser;
}
