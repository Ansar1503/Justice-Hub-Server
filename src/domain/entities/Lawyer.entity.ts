import { Client } from "./Client.entity";
import { User } from "./User.entity";

export interface LawyerDocuments {
  _id?: string;
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
}
export interface lawyer extends User, Client, Document {
  user_id: string;
  description?: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: "verified" | "rejected" | "pending" | "requested";
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: LawyerDocuments;
  rejectReason?: string;
}

export interface LawyerFilterParams {
  search: string;
  practiceAreas?: string | string[];
  specialisation?: string | string[];
  experienceMin: number;
  experienceMax: number;
  feeMin: number;
  feeMax: number;
  sortBy: "rating" | "experience" | "fee-low" | "fee-high" | "recommended";
  page: number;
  limit: number;
}
