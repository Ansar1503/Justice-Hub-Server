type SessionType = "consultation" | "follow-up";
type SessionStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export interface StartSessionInputDto {
  sessionId: string;
}

export interface StartSessionOutputDto {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: SessionType;
  status: SessionStatus;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  room_id?: string;
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
  zc: { appId: number; token: string }; 
}
