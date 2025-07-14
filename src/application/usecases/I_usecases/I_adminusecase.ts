import { Appointment } from "../../../domain/entities/Appointment.entity";
import { Client } from "../../../domain/entities/Client.entity";
import { lawyer } from "../../../domain/entities/Lawyer.entity";
import { User } from "../../../domain/entities/User.entity";

export interface IAdminUseCase {
  fetchUsers(query: {
    role: "lawyer" | "client";
    search?: string;
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    status: "all" | "verified" | "blocked";
  }): Promise<{
    data: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  fetchLawyers(query: {
    search?: string;
    status?: "verified" | "rejected" | "pending" | "requested";
    sort: "name" | "experience" | "consultation_fee" | "createdAt";
    sortBy: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    lawyers: any[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  blockUser(query: any): Promise<User>;
  changeVerificationStatus(payload: {
    user_id: string;
    status: "verified" | "rejected" | "pending" | "requested";
  }): Promise<lawyer>;
  fetchAppointments(payload: {
    search?: string;
    limit: number;
    page: number;
    sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
    sortOrder?: "asc" | "desc";
    status?:
      | "pending"
      | "confirmed"
      | "completed"
      | "cancelled"
      | "rejected"
      | "all";
    type?: "consultation" | "follow-up" | "all";
  }): Promise<{
    data: (Appointment & { clientData: Client; lawyerData: Client }[]) | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
}
