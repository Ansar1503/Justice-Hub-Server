import {
  FetchSessionsInputDto,
  FetchSessionsOutputtDto,
} from "@src/application/dtos/Admin/FetchSessionsDto";
import { Session } from "../entities/Session";

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
    end_time?: Date;
    client_joined_at?: Date;
    client_left_at?: Date;
    lawyer_left_at?: Date;
    end_reason?: string;
    callDuration?: number;
    lawyer_joined_at?: Date;
    start_time?: Date;
    room_id?: string;
    session_id: string;
    status?: Session["status"];
    notes?: string;
    summary?: string;
    follow_up_suggested?: boolean;
    follow_up_session_id?: string;
  }): Promise<Session | null>;
  findById(payload: { session_id: string }): Promise<Session | null>;
  findSessionsAggregate(
    payload: FetchSessionsInputDto
  ): Promise<FetchSessionsOutputtDto>;
}
