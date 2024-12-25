export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  inviteCode?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
