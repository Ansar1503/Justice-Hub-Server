import { CallLogs } from "@domain/entities/CallLogs";
import { IcallLogModel } from "@infrastructure/database/model/CallLogsModel";
import { IMapper } from "../IMapper";

export class CallLogsMapper implements IMapper<CallLogs, IcallLogModel> {
  toDomain(persistence: IcallLogModel): CallLogs {
    return CallLogs.fromPersistence({
      id: persistence._id,
      session_id: persistence.session_id.toString(),
      roomId: persistence.roomId,
      start_time: persistence.start_time,
      status: persistence.status,
      callDuration: persistence.callDuration,
      client_joined_at: persistence.client_joined_at,
      client_left_at: persistence.client_left_at,
      lawyer_joined_at: persistence.lawyer_joined_at,
      end_time: persistence.end_time,
      lawyer_left_at: persistence.lawyer_left_at,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toPersistence(entity: CallLogs): Partial<IcallLogModel> {
    return {
      _id: entity.id,
      session_id: entity.session_id,
      roomId: entity.roomId,
      start_time: entity.start_time,
      status: entity.status,
      callDuration: entity.callDuration,
      client_joined_at: entity.client_joined_at,
      client_left_at: entity.client_left_at,
      lawyer_joined_at: entity.lawyer_joined_at,
      end_time: entity.end_time,
      lawyer_left_at: entity.lawyer_left_at,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomainArray(persistence: IcallLogModel[]): CallLogs[] {
    return persistence.map((p) => this.toDomain(p));
  }
}
