export interface User {
  user_id: string;
  name: string;
  email: string;
  mobile?: string;
  password: string;
  role: "lawyer" | "client";
  is_blocked?: boolean;
  is_verified?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
