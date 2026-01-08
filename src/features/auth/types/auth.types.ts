export interface User {
  username: string;
  password?: string;
  oldPassword?: string;
  token: string;
  email?: string;
  avatar?: File;
  avatarUrl?: string;
  registrationDate?: string;
}
