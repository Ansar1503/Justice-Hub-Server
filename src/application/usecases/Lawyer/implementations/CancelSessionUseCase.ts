import {
  CancelSessionInputDto,
  CancelSessionOutputDto,
} from "@src/application/dtos/Lawyer/CancelSessionDto";
import { ICancelSessionUseCase } from "../ICancellSessionUseCase";
import {
  NotFoundError,
  ValidationError,
} from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";

export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(private sessionsRepo: ISessionsRepo) {}
  async execute(input: CancelSessionInputDto): Promise<CancelSessionOutputDto> {
    const sessionExist = await this.sessionsRepo.findById({
      session_id: input.session_id,
    });
    if (!sessionExist) {
      throw new NotFoundError("Session not found");
    }
    const sessionStartAt = timeStringToDate(
      sessionExist.scheduled_date,
      sessionExist.scheduled_time
    );
    const currentDate = new Date();
    if (sessionStartAt > currentDate) {
      throw new ValidationError("Session has already started!");
    }
    // console.log("sessionExist", sessionExist);
    const updated = await this.sessionsRepo.update({
      session_id: input.session_id,
      status: "cancelled",
    });
    if (!updated) throw new Error("cancelation failed");
    return {
      amount: updated.amount,
      appointment_id: updated.appointment_id,
      client_id: updated.client_id,
      createdAt: updated.createdAt,
      duration: updated.duration,
      id: updated.id,
      lawyer_id: updated.lawyer_id,
      reason: updated.reason,
      scheduled_date: updated.scheduled_date,
      scheduled_time: updated.scheduled_time,
      status: updated.status,
      type: updated.type,
      updatedAt: updated.updatedAt,
      callDuration: updated.callDuration,
      client_joined_at: updated.client_joined_at,
      client_left_at: updated.client_left_at,
      end_reason: updated.reason,
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
