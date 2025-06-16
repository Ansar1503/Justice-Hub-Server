import { Session } from "../entities/Session.entity";

export interface ISessionsRepo {
  create(payload: Session): Promise<Session>;
  aggregate(payload: {
    user_id: string;
    role: "lawyer" | "client";
    search: string;
    sort: "name" | "date" | "consultation_fee";
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
}
