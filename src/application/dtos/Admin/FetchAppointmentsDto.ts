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
  status:
    | "all"
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "rejected";
  consultation_type: "all" | "consultation" | "follow-up";
  sortBy: "amount" | "date" | "client_name" | "lawyer_name";
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
