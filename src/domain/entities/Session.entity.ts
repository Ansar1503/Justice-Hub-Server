export interface Session {
  _id?: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_at: Date;
  duration: number;
  reason: string;
  amount: number;
  type: "consultation" | "follow-up";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  lawyer_joined_at?: Date;
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
