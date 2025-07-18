export interface Appointment {
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
  createdAt?: Date;
  updateAt?: Date;
}
