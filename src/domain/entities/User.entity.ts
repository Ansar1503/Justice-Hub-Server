export interface User {
  user_id: string;
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: "lawyer" | "client" | "admin";
  is_blocked?: boolean;
  is_verified?: boolean;
}
