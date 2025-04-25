import { Client } from "./Client.entity";
import { User } from "./User.entity";

export interface lawyer extends User, Client {
  user_id: string;
  description: string;
  barcouncil_number: string;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
}
