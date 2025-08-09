import { Session } from "@domain/entities/Session";
import { IMapper } from "../IMapper";
import { ISessionModel } from "@infrastructure/database/model/SessionModel";

export class SessionMapper implements IMapper<Session, ISessionModel> {
  toDomain(persistence: ISessionModel): Session {
    return Session.fromPersistence({
      id: persistence._id,
      appointment_id: persistence.appointment_id,
      client_id: persistence.client_id,
      lawyer_id: persistence.lawyer_id,
      duration: persistence.duration,
      amount: persistence.amount,
      reason: persistence.reason,
      scheduled_date: persistence.scheduled_date,
      scheduled_time: persistence.scheduled_time,
      status: persistence.status,
      type: persistence.type,
      callDuration: persistence.callDuration,
      client_joined_at: persistence.client_joined_at,
      client_left_at: persistence.client_left_at,
      end_reason: persistence.end_reason,
      end_time: persistence.end_time,
      room_id: persistence.room_id,
      follow_up_session_id: persistence.follow_up_session_id,
      follow_up_suggested: persistence.follow_up_suggested,
      lawyer_joined_at: persistence.lawyer_joined_at,
      lawyer_left_at: persistence.lawyer_left_at,
      notes: persistence.notes,
      start_time: persistence.start_time,
      summary: persistence.summary,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }
  toDomainArray(persistence: ISessionModel[]): Session[] {
    return persistence.map((p) => this.toDomain(p));
  }
  toPersistence(entity: Session): Partial<ISessionModel> {
    return {
      _id: entity.id,
      appointment_id: entity.appointment_id,
      client_id: entity.client_id,
      lawyer_id: entity.lawyer_id,
      duration: entity.duration,
      amount: entity.amount,
      reason: entity.reason,
      scheduled_date: entity.scheduled_date,
      scheduled_time: entity.scheduled_time,
      status: entity.status,
      type: entity.type,
      callDuration: entity.callDuration,
      client_joined_at: entity.client_joined_at,
      client_left_at: entity.client_left_at,
      end_reason: entity.end_reason,
      end_time: entity.end_time,
      room_id: entity.room_id,
      follow_up_session_id: entity.follow_up_session_id,
      follow_up_suggested: entity.follow_up_suggested,
      lawyer_joined_at: entity.lawyer_joined_at,
      lawyer_left_at: entity.lawyer_left_at,
      notes: entity.notes,
      start_time: entity.start_time,
      summary: entity.summary,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
