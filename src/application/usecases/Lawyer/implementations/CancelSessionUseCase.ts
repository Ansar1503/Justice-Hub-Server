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
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class CancelSessionUseCase implements ICancelSessionUseCase {
  constructor(
    private _sessionsRepo: ISessionsRepo,
    private _appointmentRepo: IAppointmentsRepository
  ) {}
  async execute(input: CancelSessionInputDto): Promise<CancelSessionOutputDto> {
    const sessionExist = await this._sessionsRepo.findById({
      session_id: input.session_id,
    });
    if (!sessionExist) {
      throw new NotFoundError("Session not found");
    }
    const appointmentDetails = await this._appointmentRepo.findByBookingId(
      sessionExist.bookingId
    );
    if (!appointmentDetails) throw new Error("Appointment does not exists");
    const sessionStartAt = timeStringToDate(
      appointmentDetails.date,
      appointmentDetails.time
    );
    const currentDate = new Date();
    if (currentDate >= sessionStartAt) {
      throw new ValidationError("Session has already started!");
    }
    // console.log("sessionExist", sessionExist);
    const updated = await this._sessionsRepo.update({
      session_id: input.session_id,
      status: "cancelled",
    });
    if (!updated) throw new Error("cancelation failed");
    return {
      bookingId: updated.bookingId,
      caseId: updated.caseId,
      end_reason: updated.end_reason,
      appointment_id: updated.appointment_id,
      client_id: updated.client_id,
      createdAt: updated.createdAt,
      id: updated.id,
      lawyer_id: updated.lawyer_id,
      status: updated.status,
      updatedAt: updated.updatedAt,
      callDuration: updated.callDuration,
      client_joined_at: updated.client_joined_at,
      client_left_at: updated.client_left_at,
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
