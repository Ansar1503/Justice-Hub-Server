import { Address } from "./Address.entity";

export interface Client {
  user_id: string;
  profile_image?: string;
  dob?: string;
  gender?: string;
  address?: string;
}
