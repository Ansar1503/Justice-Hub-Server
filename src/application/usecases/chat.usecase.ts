import { ChatMessage, ChatSession } from "../../domain/entities/Chat.entity";
import { IChatRepo } from "../../domain/I_repository/IChatRepo";
import { ValidationError } from "../../interfaces/middelwares/Error/CustomError";
import { IChatusecase } from "./I_usecases/IChatusecase";

export class ChatUseCase implements IChatusecase {
  constructor(private chatRepo: IChatRepo) {}
  async fetchChats(payload: {
    user_id: string;
    search: string;
    page: number;
    role: "lawyer" | "client";
  }): Promise<any> {
    const aggregateresult = await this.chatRepo.aggregate(payload);
    // console.log("aggregation resltu;", aggregateresult);
    return aggregateresult;
  }

  async getChatSessionById(sessionId: string): Promise<ChatSession | null> {
    return await this.chatRepo.findById(sessionId);
  }
  async createChatMessage(message: ChatMessage): Promise<ChatMessage | null> {
    const newChatMessage = await this.chatRepo.createMessage(message);
    if (!newChatMessage) return null;
    await this.chatRepo.update({
      id: newChatMessage?.session_id || "",
      last_message: newChatMessage?._id || "",
    });
    return newChatMessage;
  }
  async fetchChatMessages(payload: {
    session_id: string;
    page: number;
  }): Promise<{ data: ChatMessage[]; nextCursor?: number }> {
    return await this.chatRepo.findMessagesBySessionId(
      payload.session_id,
      payload.page
    );
  }
  async updateChatName(payload: {
    chatId: string;
    chatName: string;
  }): Promise<ChatSession | null> {
    const { chatId, chatName } = payload;
    const updatedChat = await this.chatRepo.update({
      name: chatName,
      id: chatId,
    });
    return updatedChat;
  }

  async deleteMessage(payload: {
    messageId: string;
    sessionId: string;
  }): Promise<ChatMessage | null> {
    if (!payload.messageId) throw new ValidationError("MessageId not found");
    // console.log("payload:pa", payload);
    await this.chatRepo.deleteMessage({ messageId: payload.messageId });
    const messages = await this.chatRepo.findMessagesBySessionId(
      payload.sessionId,
      1
    );
    const lastMessage: ChatMessage | null =
      messages.data.length > 0
        ? messages?.data[messages?.data?.length - 1]
        : null;
    // console.log("lastmessage:", lastMessage);
    await this.chatRepo.update({
      id: payload.sessionId,
      last_message: lastMessage?._id || "",
    });
    return lastMessage;
  }
  async reportMessage(payload: {
    messageId: string;
    reason: string;
    reportedAt: Date;
  }): Promise<ChatMessage | null> {
    const chatExists = await this.chatRepo.findMessageById(payload.messageId);
    if (!chatExists) throw new Error("message doesnt exist");
    return await this.chatRepo.updateMessage(payload);
  }
}
