import { ChatMessage, ChatSession } from "../../domain/entities/Chat.entity";
import { IChatRepo } from "../../domain/I_repository/IChatRepo";
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
    return await this.chatRepo.createMessage(message);
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
}
