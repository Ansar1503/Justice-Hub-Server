import { UserProfile } from "../user.dto";
import { Appointment } from "./BaseAppointmentDto";

export interface FetchAppointmentsInputDto {
  user_id?: string;
  search: string;
  appointmentStatus:
    | "all"
    | "confirmed"
    | "pending"
    | "completed"
    | "cancelled"
    | "rejected";
  consultationType: "all" | "consultation" | "follow-up";
  sortBy: "client_name" | "lawyer_name" | "fee" | "date";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface appointmentOutputDto extends Appointment {
  clientData: UserProfile;
  lawyerData: UserProfile;
}

export interface FetchAppointmentsOutputDto {
  data: appointmentOutputDto[];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
