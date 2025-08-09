import {
  FetchCallLogsInputDto,
  FetchCallLogsOutputDto,
} from "@src/application/dtos/Lawyer/FetchCallLogsDto";
import { IFetchCallLogsUseCase } from "../IFetchCallLogsUseCase";
import { ICallLogs } from "@domain/IRepository/ICallLogs";

export class FetchCallLogsUseCase implements IFetchCallLogsUseCase {
  constructor(private callLogsRepo: ICallLogs) {}
  async execute(input: FetchCallLogsInputDto): Promise<FetchCallLogsOutputDto> {
    const result = await this.callLogsRepo.findBySessionId(input);
    return {
      currentPage: result.currentPage,
      totalCount: result.totalCount,
      totalPages: result.totalPages,
      data: !result.data
        ? []
        : result.data.map((c) => ({
            createdAt: c.createdAt,
            id: c.id,
            roomId: c.roomId,
            session_id: c.session_id,
            start_time: c.start_time,
            status: c.status,
            updatedAt: c.updatedAt,
            callDuration: c.callDuration,
            client_joined_at: c.client_joined_at,
            client_left_at: c.client_left_at,
            end_reason: c.end_reason,
            end_time: c.end_time,
            lawyer_joined_at: c.lawyer_joined_at,
            lawyer_left_at: c.lawyer_left_at,
          })),
    };
  }
}
