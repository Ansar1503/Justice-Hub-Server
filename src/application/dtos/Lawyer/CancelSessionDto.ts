type SessionType = "consultation" | "follow-up";
type SessionStatus =
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled"
  | "missed";

export interface CancelSessionInputDto {
  session_id: string;
  status?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  lawyer_joined_at?: Date;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
}

export interface CancelSessionOutputDto {
  id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  caseId: string;
  bookingId: string;
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
}
