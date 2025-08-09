export interface FetchAppointmentsInputDto {
  client_id: string;
  search: string;
  appointmentStatus:
    | "all"
    | "confirmed"
    | "pending"
    | "completed"
    | "cancelled"
    | "rejected";
  appointmentType: "all" | "consultation" | "follow-up";
  sortField: "name" | "date" | "consultation_fee" | "created_at";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
}

export interface FetchAppointmentsOutputDto {
  data: any;
  totalCount: number;
  currentPage: number;
  totalPage: number;
}
