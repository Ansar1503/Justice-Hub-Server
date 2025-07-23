import { CallLogs as CallLogsEntity } from "../../../domain/entities/CallLogs";
import { ICallLogs } from "../../../domain/I_repository/ICallLogs";
import { CallLogsModel } from "../model/callLogs";

export class CallLogsRepo implements ICallLogs {
  async create(payload: CallLogsEntity): Promise<CallLogsEntity> {
    const newLog = new CallLogsModel(payload);
    await newLog.save();
    return newLog;
  }
  async findBySessionId(payload: {
    sessionId: string;
    limit: number;
    page: number;
  }): Promise<{
    data: CallLogsEntity[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { limit, page, sessionId } = payload;
    const skip = (page - 1) * limit;
    const data = await CallLogsModel.find({ sessionId: sessionId })
      .limit(limit)
      .skip(skip);
    const totalCount = await CallLogsModel.countDocuments({
      sessionId: sessionId,
    });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    return {
      data,
      totalCount,
      currentPage,
      totalPages,
    };
  }
}
