export interface Appointment {
  id: string;
  lawyer_id: string;
  client_id: string;
  date: Date;
  time: string;
  duration: number;
  reason: string;
  amount: number;
  payment_status: "pending" | "success" | "failed";
  type: "consultation" | "follow-up";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  createdAt: Date;
  updatedAt: Date;
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

export interface FetchAppointmentsInputDto {
  client_id: string;
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
