import { IChatSessionRepo } from "@domain/IRepository/IChatSessionRepo";
// import { ChatMessage, ChatSession } from "../../domain/entities/Chat.entity";
import { Client } from "../../domain/entities/Client";
import { Session } from "../../domain/entities/Session";
import { ISessionsRepo } from "../../domain/IRepository/ISessionsRepo";
// import { IChatRepo } from "../../domain/IRepository/IChatRepo";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";
import { IChatusecase } from "./IUseCases/IChatusecase";
import { IChatMessagesRepo } from "@domain/IRepository/IChatMessagesRepo";
import { ChatSession } from "@domain/entities/ChatSession";
import { FetchChatSessionOutPutDto } from "../dtos/chats/fetchChatsDto";
import { ChatMessage } from "@domain/entities/ChatMessage";
import {
  ChatMessageInputDto,
  ChatMessageOutputDto,
} from "../dtos/chats/ChatMessageDto";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { Disputes } from "@domain/entities/Disputes";

export class ChatUseCase implements IChatusecase {
  constructor(
    private chatSessionRepo: IChatSessionRepo,
    private chatMessageRepo: IChatMessagesRepo,
    private sessionRepo: ISessionsRepo,
    private _disputesRepo: IDisputes
  ) {}
  async fetchChats(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<{ data: any[]; nextCursor?: number }> {
    const aggregateresult = await this.chatSessionRepo.aggregate(payload);
    // console.log("aggregation resltu;", aggregateresult);
    return aggregateresult;
  }

  async getChatSessionById(
    sessionId: string
  ): Promise<FetchChatSessionOutPutDto | null> {
    const chatSession = await this.chatSessionRepo.findById(sessionId);
    if (!chatSession) return null;
    return {
      createdAt: chatSession.createdAt,
      id: chatSession.id,
      last_message: chatSession.lastMessage,
      name: chatSession.name,
      participants: chatSession.participants,
      session_id: chatSession.sessionId,
      updatedAt: chatSession.updatedAt,
    };
  }
  async createChatMessage(
    message: ChatMessageInputDto
  ): Promise<ChatMessageOutputDto | null> {
    // console.log("newmessage", message);
    const messagepayload = ChatMessage.create({
      receiverId: message.receiverId,
      senderId: message.senderId,
      session_id: message.session_id,
      attachments: message.attachments,
      content: message.content,
    });
    const newChatMessage = await this.chatMessageRepo.create(messagepayload);
    if (!newChatMessage) return null;

    await this.chatSessionRepo.update({
      id: newChatMessage?.sessionId || "",
      last_message: newChatMessage?.id || "",
    });
    return {
      createdAt: newChatMessage.createdAt,
      id: newChatMessage.id,
      read: newChatMessage.read,
      active: newChatMessage.active,
      receiverId: newChatMessage.receiverId,
      senderId: newChatMessage.senderId,
      session_id: newChatMessage.sessionId,
      updatedAt: newChatMessage.updatedAt,
      attachments: newChatMessage.attachments,
      content: newChatMessage.content,
    };
  }
  async fetchChatMessages(payload: {
    session_id: string;
    page: number;
  }): Promise<{ data: ChatMessageOutputDto[]; nextCursor?: number }> {
    const messages = await this.chatMessageRepo.findMessagesBySessionId(
      payload.session_id,
      payload.page
    );
    return {
      data: messages.data.map((m) => ({
        id: m.id,
        createdAt: m.createdAt,
        read: m.read,
        active: m.active,
        receiverId: m.receiverId,
        senderId: m.senderId,
        session_id: m.sessionId,
        updatedAt: m.updatedAt,
        attachments: m.attachments,
        content: m.content,
      })),
      nextCursor: messages.nextCursor,
    };
  }

  async updateChatName(payload: {
    chatId: string;
    chatName: string;
  }): Promise<ChatSession | null> {
    const { chatId, chatName } = payload;
    const updatedChat = await this.chatSessionRepo.update({
      name: chatName,
      id: chatId,
    });
    return updatedChat;
  }

  async deleteMessage(payload: {
    messageId: string;
    sessionId: string;
  }): Promise<ChatMessageOutputDto | null> {
    if (!payload.messageId) throw new ValidationError("MessageId not found");
    // console.log("delete paylaod :: ", payload);
    await this.chatMessageRepo.update({
      messageId: payload.messageId,
      active: false,
    });
    const messages = await this.chatMessageRepo.findMessagesBySessionId(
      payload.sessionId,
      1
    );
    const lastMessage: ChatMessage | null =
      messages.data.length > 0
        ? messages?.data[messages?.data?.length - 1]
        : null;
    await this.chatSessionRepo.update({
      id: payload.sessionId,
      last_message: lastMessage?.id || "",
    });
    if (!lastMessage) return null;
    return {
      active: lastMessage.active,
      createdAt: lastMessage.createdAt,
      id: lastMessage.id,
      read: lastMessage.read,
      updatedAt: lastMessage.updatedAt,
      receiverId: lastMessage.receiverId,
      senderId: lastMessage.senderId,
      session_id: lastMessage.sessionId,
      attachments: lastMessage.attachments,
      content: lastMessage.content,
    };
  }

  async reportMessage(payload: {
    messageId: string;
    reason: string;
    reportedAt: Date;
  }): Promise<void> {
    const chatExists = await this.chatMessageRepo.findById(payload.messageId);
    if (!chatExists) throw new Error("message doesnt exist");
    const disputePayload = Disputes.create({
      contentId: payload.messageId,
      reason: payload.reason,
      disputeType: "messages",
      reportedBy: chatExists.senderId,
      reportedUser: chatExists.receiverId,
      status: "pending",
    });
    await this._disputesRepo.create(disputePayload);
  }
  async getSessionDetails(sessionId: string): Promise<Session | null> {
    return await this.sessionRepo.findById({ session_id: sessionId });
  }
  async fetchDisputes(payload: {
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
  }> {
    return await this.chatMessageRepo.fetchDisputesAggregation(payload);
  }
}
