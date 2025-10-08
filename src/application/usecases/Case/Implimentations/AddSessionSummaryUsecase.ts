import { BaseSessionDto } from "@src/application/dtos/sessions/BaseSessionDto";
import { IAddSessionSummaryUsecase } from "../Interfaces/IAddSessionSummaryUsecase";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";

export class AddSessionSummaryUsecase implements IAddSessionSummaryUsecase {
  constructor(private _sessionRepo: ISessionsRepo) {}
  async execute(input: {
    sessionId: string;
    summary: string;
  }): Promise<BaseSessionDto> {
    const sessionExists = await this._sessionRepo.findById({
      session_id: input.sessionId,
    });
    if (!sessionExists) throw new Error("Session not found");
    const updated = await this._sessionRepo.update({
      session_id: input.sessionId,
      summary: input.summary,
    });
    if (!updated) throw new Error("error updating sesison");
    return {
      appointment_id: updated.appointment_id,
      bookingId: updated.bookingId,
      caseId: updated.caseId,
      client_id: updated.client_id,
      createdAt: updated.createdAt,
      id: updated.id,
      lawyer_id: updated.lawyer_id,
      status: updated.status,
      updatedAt: updated.updatedAt,
      callDuration: updated.callDuration,
      client_joined_at: updated.client_joined_at,
      client_left_at: updated.client_left_at,
      end_reason: updated.end_reason,
      end_time: updated.end_time,
      follow_up_session_id: updated.follow_up_session_id,
      follow_up_suggested: updated.follow_up_suggested,
      lawyer_joined_at: updated.lawyer_joined_at,
      lawyer_left_at: updated.lawyer_left_at,
      notes: updated.notes,
      room_id: updated.room_id,
      start_time: updated.start_time,
      summary: updated.summary,
    };
  }
}
