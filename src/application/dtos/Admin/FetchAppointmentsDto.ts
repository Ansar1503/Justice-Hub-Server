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
  search: string;
  limit: number;
  page: number;
  sortBy: "date" | "amount" | "lawyer_name" | "client_name";
  sortOrder: "asc" | "desc";
  status:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rejected"
    | "all";
  consultation_type: "consultation" | "follow-up" | "all";
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
