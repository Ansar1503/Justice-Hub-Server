export interface CallLogs {
  session_id: string;
  room_id: string;
  duration?: number;
  status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
  start_time?: Date;
  end_time?: Date;
  client_joined_at?: Date;
  client_left_at?: Date;
  lawyer_joined_at?: Date;
  lawyer_left_at?: Date;
  end_reason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
