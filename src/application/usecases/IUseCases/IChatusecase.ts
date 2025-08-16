import { ChatSession } from "@domain/entities/ChatSession";
import { Client } from "../../../domain/entities/Client";
import { Session } from "../../../domain/entities/Session";
import { ChatMessage } from "@domain/entities/ChatMessage";
import { FetchChatSessionOutPutDto } from "@src/application/dtos/chats/fetchChatsDto";
import {
  ChatMessageInputDto,
  ChatMessageOutputDto,
} from "@src/application/dtos/chats/ChatMessageDto";

export interface IChatusecase {
  fetchChats(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<any>;
  getChatSessionById(
    sessionId: string
  ): Promise<FetchChatSessionOutPutDto | null>;
  getSessionDetails(sessionId: string): Promise<Session | null>;
  createChatMessage(
    message: ChatMessageInputDto
  ): Promise<ChatMessageOutputDto | null>;
  fetchChatMessages(payload: {
    session_id: string;
    page: number;
  }): Promise<{ data: ChatMessageOutputDto[]; nextCursor?: number }>;
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
  }): Promise<void>;
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
