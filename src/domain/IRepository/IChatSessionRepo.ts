import { ChatSession } from "@domain/entities/ChatSession";

export interface IChatSessionRepo {
  create(payload: ChatSession): Promise<ChatSession>;
  aggregate(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<{ data: any[]; nextCursor?: number }>;
  findById(id: string): Promise<ChatSession | null>;
  update(payload: {
    name?: string;
    last_message?: string;
    id: string;
  }): Promise<ChatSession | null>;
  findByUserId(userId: string): Promise<ChatSession[] | []>;
}
