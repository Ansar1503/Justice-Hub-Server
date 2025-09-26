import { StartSessionOutputDto } from "@src/application/dtos/Lawyer/StartSessionDto";
import { IJoinSessionUseCase } from "../IJoinSessionUseCase";
import { createToken } from "@src/application/services/ZegoCloud.service";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class JoinSessionUseCase implements IJoinSessionUseCase {
  constructor(
    private _sessionsRepo: ISessionsRepo,
    private _appointmentRepo: IAppointmentsRepository
  ) {}
  async execute(input: { sessionId: string }): Promise<StartSessionOutputDto> {
    const existingSession = await this._sessionsRepo.findById({
      session_id: input.sessionId,
    });
    if (!existingSession) throw new ValidationError("session not found");
    const appointmentDetails = await this._appointmentRepo.findByBookingId(
      existingSession.bookingId
    );
    if (!appointmentDetails) throw new Error("Appointment not found");
    switch (existingSession.status) {
      case "cancelled":
        throw new ValidationError("Session is cancelled");
      case "completed":
        throw new ValidationError("Session is completed");
      case "missed":
        throw new ValidationError("Session is missed");
      default:
        break;
    }
    const slotDateTime = timeStringToDate(
      appointmentDetails.date,
      appointmentDetails.time
    );
    const newDate = new Date();
    // if (newDate < slotDateTime) {
    //   throw new ValidationError("Scheduled time is not reached");
    // }
    slotDateTime.setMinutes(
      slotDateTime.getMinutes() + appointmentDetails.duration + 5
    );
    // if (newDate > slotDateTime)
    //   throw new ValidationError("session time is over");
    // console.log("sessssion", existingSession.);
    const { appId, token } = await createToken({
      userId: existingSession.client_id,
      roomId: existingSession.room_id,
      expiry: appointmentDetails.duration * 60,
    });

    return {
      bookingId: existingSession.bookingId,
      caseId: existingSession.caseId,
      appointment_id: existingSession.appointment_id,
      client_id: existingSession.client_id,
      createdAt: existingSession.createdAt,
      id: existingSession.id,
      lawyer_id: existingSession.lawyer_id,
      status: existingSession.status,
      updatedAt: existingSession.updatedAt,
      callDuration: existingSession.callDuration,
      client_joined_at: existingSession.client_joined_at,
      client_left_at: existingSession.client_left_at,
      end_reason: existingSession.end_reason,
      end_time: existingSession.end_time,
      follow_up_session_id: existingSession.follow_up_session_id,
      follow_up_suggested: existingSession.follow_up_suggested,
      lawyer_joined_at: existingSession.lawyer_joined_at,
      lawyer_left_at: existingSession.lawyer_left_at,
      notes: existingSession.notes,
      room_id: existingSession.room_id,
      start_time: existingSession.start_time,
      summary: existingSession.summary,
      zc: { appId, token },
    };
  }
}
