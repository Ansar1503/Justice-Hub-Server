import { CallLogs } from "../entities/CallLogs";

export interface ICallLogs {
  findBySessionId(payload: {
    sessionId: string;
    limit: number;
    page: number;
  }): Promise<{
    data: CallLogs[] | [];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;
  create(payload: CallLogs): Promise<CallLogs>;
  updateByRoomId(payload: Partial<CallLogs>): Promise<CallLogs | null>;
  findByRoomId(payload: { roomId: string }): Promise<CallLogs[]>;
}
