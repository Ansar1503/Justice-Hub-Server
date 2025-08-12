import { ChatMessage } from "@domain/entities/ChatMessage";

export interface IChatMessagesRepo {
  create(payload: ChatMessage): Promise<ChatMessage >;
  findMessagesBySessionId(
    id: string,
    page: number
  ): Promise<{ data: ChatMessage[] | []; nextCursor?: number }>;
  delete(payload: { messageId: string }): Promise<ChatMessage | null>;
  update(payload: {
    messageId: string;
    reason?: string;
    reportedAt?: Date;
    read?: boolean;
  }): Promise<ChatMessage | null>;
  findById(messageId: string): Promise<ChatMessage | null>;
  fetchDisputesAggregation(payload: {
    search: string;
    sortBy: "All" | "session_date" | "reported_date";
    sortOrder: "asc" | "desc";
    limit: number;
    page: number;
  }): Promise<{
    data:
      | (ChatMessage &
          {
            chatSession: any & {
              clientData: any;
              lawyerData: any;
            };
          }[])
      | [];
    totalCount: number;
    currentPage: number;
    totalPage: number;
  }>;
}
