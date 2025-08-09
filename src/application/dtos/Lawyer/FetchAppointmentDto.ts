import { Appointment } from "@domain/entities/Appointment";

export interface FetchAppointmentInputDto {
  lawyer_id: string;
  search: string;
  appointmentStatus:
    | "all"
    | "confirmed"
    | "pending"
    | "completed"
    | "cancelled"
    | "rejected";
  appointmentType: "all" | "consultation" | "follow-up";
  sortField: "name" | "date" | "consultation_fee" | "created_at";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  user_id: string;
  profile_image: string;
  dob: string;
  gender: string;
}

export interface FetchAppointmentsOutputDto {
  data:
    | (Appointment & {
        clientData: UserProfile;
        lawyerData: UserProfile;
      })[]
    | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
