import { CallLogs as CallLogsEntity } from "../../../domain/entities/CallLogs";
import { ICallLogs } from "../../../domain/I_repository/ICallLogs";
import { CallLogsModel } from "../model/callLogs";

export class CallLogsRepo implements ICallLogs {
  async create(payload: CallLogsEntity): Promise<CallLogsEntity> {
    const newLog = new CallLogsModel(payload);
    await newLog.save();
    const plainLog = newLog.toObject();
    return {
      ...plainLog,
      session_id: plainLog.session_id?.toString?.() ?? plainLog.session_id,
    } as CallLogsEntity;
  }
  async findBySessionId(payload: {
    sessionId: string;
    limit: number;
    page: number;
  }): Promise<{
    data: CallLogsEntity[] | [];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }> {
    const { limit, page, sessionId } = payload;
    const skip = (page - 1) * limit;
    const data = await CallLogsModel.find({ session_id: sessionId })
      .limit(limit)
      .skip(skip)
      .lean();

    const totalCount = await CallLogsModel.countDocuments({
      session_id: sessionId,
    });
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = page;
    return {
      data: data.map((log) => ({
        ...log,
        session_id: log.session_id?.toString?.() ?? log.session_id,
        _id: log._id?.toString?.() ?? log._id,
      })) as CallLogsEntity[],
      totalCount,
      currentPage,
      totalPages,
    };
  }
  async updateByRoomId(
    payload: Partial<CallLogsEntity>
  ): Promise<CallLogsEntity | null> {
    const {
      roomId,
      callDuration,
      client_joined_at,
      client_left_at,
      end_reason,
      end_time,
      lawyer_joined_at,
      lawyer_left_at,
      start_time,
      session_id,
      status,
    } = payload;
    if (!roomId) return null;
    const update: any = {};
    if (callDuration) {
      update.call_duration = callDuration;
    }
    if (client_joined_at) {
      update.client_joined_at = client_joined_at;
    }
    if (client_left_at) {
      update.client_left_at = client_left_at;
    }
    if (end_reason) {
      update.end_reason = end_reason;
    }
    if (end_time) {
      update.end_time = end_time;
    }
    if (lawyer_joined_at) {
      update.lawyer_joined_at = lawyer_joined_at;
    }
    if (lawyer_left_at) {
      update.lawyer_left_at = lawyer_left_at;
    }
    if (start_time) {
      update.start_time = start_time;
    }
    if (session_id) {
      update.session_id = session_id;
    }
    if (status) {
      update.status = status;
    }
    const updatedLog = await CallLogsModel.findOneAndUpdate(
      { room_id: roomId },
      { $set: update },
      { new: true }
    );
    console.log("updatedLogs:", updatedLog);
    if (!updatedLog) return null;
    const plainLog = updatedLog.toObject();
    return {
      ...plainLog,
      session_id: plainLog.session_id?.toString?.() ?? plainLog.session_id,
      _id: plainLog._id?.toString?.() ?? plainLog._id,
    } as CallLogsEntity;
  }
}
