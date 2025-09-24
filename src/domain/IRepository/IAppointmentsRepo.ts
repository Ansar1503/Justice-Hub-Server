import {
  FetchAppointmentsInputDto,
  FetchAppointmentsOutputDto,
} from "@src/application/dtos/Appointments/FetchAppointmentsDto";
import { Appointment } from "../entities/Appointment";
import { Client } from "../entities/Client";

export interface IAppointmentsRepository {
  create(payload: Appointment): Promise<Appointment>;
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
  findByBookingId(id: string): Promise<Appointment | null>;
  findAllAggregate(
    payload: FetchAppointmentsInputDto
  ): Promise<FetchAppointmentsOutputDto>;
  findByClientID(client: string): Promise<Appointment[] | []>;
  findByCaseId(id: string): Promise<Appointment[] | []>;
}
