import { Appointment } from "../entities/Appointment.entity";

export interface IAppointmentsRepository {
  findByDateandLawyer_id(payload: {
    lawyer_id: string;
    date: Date;
  }): Promise<Appointment[] | null>;
  findByDateandClientId(payload: {
    client_id: string;
    date: Date;
  }): Promise<Appointment[] | null>;
  createWithTransaction(payload: Appointment): Promise<Appointment>;
  Update(payload: Partial<Appointment>): Promise<Appointment | null>;
  delete(payload: Partial<Appointment>): Promise<Appointment | null>;
  findForClientsUsingAggregation(payload: {
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
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
  findForLawyersUsingAggregation(payload: {
    lawyer_id: string;
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
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
  updateWithId(payload: {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
  }): Promise<Appointment | null>;
  findById(id: string): Promise<Appointment | null>;
}
