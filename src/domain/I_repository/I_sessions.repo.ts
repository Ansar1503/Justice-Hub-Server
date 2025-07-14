import { Client } from "../entities/Client.entity";
import { Session, SessionDocument } from "../entities/Session.entity";

export interface ISessionsRepo {
  create(payload: Session): Promise<Session>;
  aggregate(payload: {
    user_id: string;
    role: "lawyer" | "client";
    search: string;
    sort: "name" | "date" | "amount" | "created_at";
    order: "asc" | "desc";
    status?: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
    consultation_type?: "consultation" | "follow-up";
    page: number;
    limit: number;
  }): Promise<{
    data: any;
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
  update(payload: {
    session_id: string;
    status?: Session["status"];
    roomId?: string;
    start_time?: Date;
    end_time?: Date;
    client_joined_at?: Date;
    lawyer_joined_at?: Date;
    notes?: string;
    summary?: string;
    follow_up_suggested?: boolean;
    follow_up_session_id?: string;
  }): Promise<Session | null>;
  findById(payload: { session_id: string }): Promise<Session | null>;
  findSessionsAggregate(payload: {
    search?: string;
    limit: number;
    page: number;
    sortBy?: "date" | "amount" | "lawyer_name" | "client_name";
    sortOrder?: "asc" | "desc";
    status?:
      | "upcoming"
      | "ongoing"
      | "completed"
      | "cancelled"
      | "missed"
      | "all";
    type?: "consultation" | "follow-up" | "all";
  }): Promise<{
    data: (Session & { clientData: Client; lawyerData: Client }[]) | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;

  // sessiolnDocuments
  createDocument(payload: SessionDocument): Promise<SessionDocument | null>;
  findDocumentBySessionId(payload: {
    session_id: string;
  }): Promise<SessionDocument | null>;
  removeDocument(documentId: string): Promise<SessionDocument | null>;
  removeAllDocuments(id: string): Promise<void>;
}
