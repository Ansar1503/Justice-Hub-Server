import { ChatSession, ChatMessage } from "../../../domain/entities/Chat.entity";

export interface IChatusecase {
  fetchChats(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<any>;
  getChatSessionById(sessionId: string): Promise<ChatSession | null>;
  createChatMessage(message: ChatMessage): Promise<ChatMessage | null>;
  fetchChatMessages(payload: {
    session_id: string;
    page: number;
  }): Promise<{ data: ChatMessage[]; nextCursor?: number }>;
  updateChatName(payload: {
    chatId: string;
    chatName: string;
  }): Promise<ChatSession | null>;
  deleteMessage(payload: {
    messageId: string;
    sessionId: string;
  }): Promise<ChatMessage | null>;
  reportMessage(payload: {
    messageId: string;
    reason: string;
    reportedAt: Date;
  }): Promise<ChatMessage | null>;
}
