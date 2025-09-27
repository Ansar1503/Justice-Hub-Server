export interface FetchCallLogsInputDto {
    sessionId: string;
    limit: number;
    page: number;
}
export interface FetchCallLogsOutputDto {
    data:
        | {
              id: string;
              roomId: string;
              session_id: string;
              start_time?: Date;
              end_time?: Date;
              client_joined_at?: Date;
              client_left_at?: Date;
              lawyer_joined_at?: Date;
              lawyer_left_at?: Date;
              end_reason?: string;
              callDuration?: number;
              status: "ongoing" | "completed" | "cancelled" | "missed" | "dropped";
              createdAt: Date;
              updatedAt: Date;
          }[]
        | [];
    totalCount: number;
    currentPage: number;
    totalPages: number;
}
