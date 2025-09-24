import { Appointment } from "../Appointments/BaseAppointmentDto";
import { UserProfile } from "../user.dto";
import { BaseSessionDto } from "./BaseSessionDto";

interface SessionData extends BaseSessionDto {
  clientData: UserProfile;
  lawyerData: UserProfile;
  appointmentDetails: Appointment;
}
export interface FetchSessionsOutputtDto {
  data: SessionData[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}

export interface FetchSessionsInputDto {
  user_id?: string;
  search?: string;
  limit: number;
  page: number;
  sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder?: "asc" | "desc";
  status?:
    | "upcoming"
    | "ongoing"
    | "completed"
    | "cancelled"
    | "missed"
    | "all";
  consultation_type?: "consultation" | "follow-up" | "all";
}
