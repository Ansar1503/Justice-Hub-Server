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
}
