import { ChatSession } from "../entities/Chat.entity";

export interface IChatRepo {
  create(payload: ChatSession): Promise<ChatSession>;
  aggregate(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<{ data: any[]; nextCursor?: number }>;
}
