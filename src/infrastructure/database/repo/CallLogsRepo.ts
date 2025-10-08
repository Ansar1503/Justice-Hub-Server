import { IMapper } from "@infrastructure/Mapper/IMapper";
import { CallLogsMapper } from "@infrastructure/Mapper/Implementations/CallLogsMapper";
import { CallLogs as CallLogsEntity } from "../../../domain/entities/CallLogs";
import { ICallLogs } from "../../../domain/IRepository/ICallLogs";
import { CallLogsModel, IcallLogModel } from "../model/CallLogsModel";
import { ClientSession } from "mongoose";

export class CallLogsRepository implements ICallLogs {
  constructor(
    private mapper: IMapper<
      CallLogsEntity,
      IcallLogModel
    > = new CallLogsMapper(),
    private _session?: ClientSession
  ) {}

  async create(payload: CallLogsEntity): Promise<CallLogsEntity> {
    const newLog = new CallLogsModel(this.mapper.toPersistence(payload));
    await newLog.save({ session: this._session });
    return this.mapper.toDomain(newLog);
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
      data:
        data && this.mapper.toDomainArray
          ? this.mapper.toDomainArray(data)
          : [],
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
      update.callDuration = callDuration;
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
    if (end_time) {
      update.end_time = end_time;
    }
    if (session_id) {
      update.session_id = session_id;
    }
    if (status) {
      update.status = status;
    }
    const updatedLog = await CallLogsModel.findOneAndUpdate(
      { roomId: roomId },
      { $set: update },
      { new: true }
    );
    // console.log("updatedLogs:", updatedLog);
    if (!updatedLog) return null;
    return this.mapper.toDomain(updatedLog);
  }
}
