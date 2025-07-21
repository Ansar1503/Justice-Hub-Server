import { CallLogs } from "../../../domain/entities/CallLogs";
import { ICallLogs } from "../../../domain/I_repository/ICallLogs";
import { CallLogsModel } from "../model/callLogs";

export class CallLogsRepository implements ICallLogs {
  async findBySessionId(payload: {
    sessionId: string;
    limit: number;
    page: number;
  }): Promise<{
    data: CallLogs[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { limit, page, sessionId } = payload;
    const skip = page > 0 ? (page - 1) * limit : 0;
    const count = await CallLogsModel.countDocuments({ session_id: sessionId });
    const logs = await CallLogsModel.find({ session_id: sessionId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const data = logs.map((log) => ({
      ...log.toJSON(),
      session_id: sessionId.toString(),
    }));
    const totalCount = count || 0;
    const totalPage = Math.ceil(totalCount / limit);
    return {
      currentPage: page,
      totalPages: totalPage,
      totalCount,
      data,
    };
  }
}
