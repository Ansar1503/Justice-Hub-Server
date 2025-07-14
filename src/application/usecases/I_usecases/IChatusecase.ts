import { ChatSession, ChatMessage } from "../../../domain/entities/Chat.entity";
import { Client } from "../../../domain/entities/Client.entity";
import { Session } from "../../../domain/entities/Session.entity";

export interface IChatusecase {
  fetchChats(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<any>;
  getChatSessionById(sessionId: string): Promise<ChatSession | null>;
  getSessionDetails(sessionId: string): Promise<Session | null>;
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
  fetchDisputes(payload: {
    search: string;
    sortBy: "All" | "session_date" | "reported_date";
    sortOrder: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    data:
      | (ChatMessage &
          {
            chatSession: ChatSession & {
              clientData: Client;
              lawyerData: Client;
            };
          }[])
      | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
}
