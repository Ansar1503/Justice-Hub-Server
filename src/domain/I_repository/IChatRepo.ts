import { ChatMessage, ChatSession } from "../entities/Chat.entity";

export interface IChatRepo {
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

  // messages
  createMessage(payload: ChatMessage): Promise<ChatMessage | null>;
  findMessagesBySessionId(
    id: string,
    page: number
  ): Promise<{ data: ChatMessage[]; nextCursor?: number }>;
  deleteMessage(payload: { messageId: string }): Promise<void>;
  updateMessage(payload: {
    messageId: string;
    reason?: string;
    reportedAt?: Date;
    read?: boolean;
  }): Promise<ChatMessage | null>;
  findMessageById(messageId: string): Promise<ChatMessage | null>;
}
