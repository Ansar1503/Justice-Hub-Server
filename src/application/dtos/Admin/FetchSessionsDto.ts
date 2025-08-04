export interface Session {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: "consultation" | "follow-up";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";

  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  callDuration?: number;
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
interface SessionData extends Session {
  clientData: UserProfile;
  lawyerData: UserProfile;
}
export interface FetchSessionsOutputtDto {
  data: SessionData[] | [];
  totalCount: number;
  currentPage: number;
  totalPage: number;
}

export interface FetchSessionsInputDto {
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
  type?: "consultation" | "follow-up" | "all";
}
