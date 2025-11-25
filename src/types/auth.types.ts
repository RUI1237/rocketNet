export interface User {
  username: string;
  password?: string;
  oldPassword?: string;
  token: string;
  email?: string;
  // avatar?: File;
  processedaAatarUrl?: string;
  phone?: string;
  registrationDate?: string;
  // role?: string;
}
