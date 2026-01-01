import { randomUUID } from "crypto";
import {
  StartSessionInputDto,
  StartSessionOutputDto,
} from "@src/application/dtos/Lawyer/StartSessionDto";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { createToken } from "@src/application/services/ZegoCloud.service";
import { CallLogs } from "@domain/entities/CallLogs";
import { ICallLogs } from "@domain/IRepository/ICallLogs";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IStartSessionUseCase } from "../IStartSessionUseCase";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";

export class StartSessionUseCase implements IStartSessionUseCase {
  constructor(
    private _sessionsRepo: ISessionsRepo,
    private _callLogsRepo: ICallLogs,
    private _appointmentDetails: IAppointmentsRepository,
    private _uow: IUnitofWork
  ) {}
  async execute(input: StartSessionInputDto): Promise<StartSessionOutputDto> {
    const existingSession = await this._sessionsRepo.findById({
      session_id: input.sessionId,
    });
    if (!existingSession) throw new ValidationError("session not found");
    const appointmentDetails = await this._appointmentDetails.findByBookingId(
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
    const roomId = `Room_${randomUUID()}`;

    const { appId, token } = await createToken({
      userId: existingSession.lawyer_id,
      roomId: roomId,
      expiry: appointmentDetails?.duration * 60,
    });
    return this._uow.startTransaction(async (uow) => {
      const newcallLog = CallLogs.create({
        status: "ongoing",
        start_time: newDate,
        lawyer_joined_at: newDate,
        session_id: input.sessionId,
        roomId: roomId,
      });
      try {
        await uow.callLogsRepo.create(newcallLog);
      } catch (error) {
        console.log("errors", error);
        throw new Error("call log creation failed");
      }
      const session = await uow.sessionRepo.update({
        start_time: newDate,
        room_id: roomId,
        lawyer_joined_at: newDate,
        session_id: input.sessionId,
        status: "ongoing",
      });
      if (!session) throw new Error("session start failed");
      return {
        bookingId: session.bookingId,
        caseId: session.caseId,
        appointment_id: session.appointment_id,
        client_id: session.client_id,
        createdAt: session.createdAt,
        id: session.id,
        lawyer_id: session.lawyer_id,
        status: session.status,
        updatedAt: session.updatedAt,
        callDuration: session.callDuration,
        client_joined_at: session.client_joined_at,
        client_left_at: session.client_left_at,
        end_reason: session.end_reason,
        end_time: session.end_time,
        follow_up_session_id: session.follow_up_session_id,
        follow_up_suggested: session.follow_up_suggested,
        lawyer_joined_at: session.lawyer_joined_at,
        lawyer_left_at: session.lawyer_left_at,
        notes: session.notes,
        room_id: session.room_id,
        start_time: session.start_time,
        summary: session.summary,
        zc: { appId, token },
      };
    });
  }
}
