export interface Appointment {
  lawyer_id: string;
  client_id: string;
  date: string;
  time: string;
  document?:string;
  reason:string;
  payment_status: "pending" | "success" | "failed";
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  createdAt?: string;
}
