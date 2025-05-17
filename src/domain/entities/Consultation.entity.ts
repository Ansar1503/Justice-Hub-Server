export interface Consultation {
  lawyer_id: string;
  client_id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rejected";
  createdAt?:string;
}