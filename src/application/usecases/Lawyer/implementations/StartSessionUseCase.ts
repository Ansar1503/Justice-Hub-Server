import {
  StartSessionInputDto,
  StartSessionOutputDto,
} from "@src/application/dtos/Lawyer/StartSessionDto";
import { IStartSessionUseCase } from "../IStartSessionUseCase";
import { randomUUID } from "crypto";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { createToken } from "@src/application/services/ZegoCloud.service";
import { CallLogs } from "@domain/entities/CallLogs";
import { ICallLogs } from "@domain/IRepository/ICallLogs";

export class StartSessionUseCase implements IStartSessionUseCase {
  constructor(
    private sessionsRepo: ISessionsRepo,
    private callLogsRepo: ICallLogs
  ) {}
  async execute(input: StartSessionInputDto): Promise<StartSessionOutputDto> {
    const existingSession = await this.sessionsRepo.findById({
      session_id: input.sessionId,
    });
    if (!existingSession) throw new ValidationError("session not found");

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
      existingSession.scheduled_date,
      existingSession.scheduled_time
    );
    const newDate = new Date();
    // if (newDate < slotDateTime) {
    //   throw new ValidationError("Scheduled time is not reached");
    // }
    slotDateTime.setMinutes(
      slotDateTime.getMinutes() + existingSession.duration + 5
    );
    // if (newDate > slotDateTime)
    //   throw new ValidationError("session time is over");
    const roomId = `Room_${randomUUID()}`;

    const { appId, token } = await createToken({
      userId: existingSession.lawyer_id,
      roomId: roomId,
      expiry: existingSession?.duration * 60,
    });
    const newcallLog = CallLogs.create({
      status: "ongoing",
      start_time: newDate,
      lawyer_joined_at: newDate,
      session_id: input.sessionId,
      roomId: roomId,
    });
    await this.callLogsRepo.create(newcallLog);
    const session = await this.sessionsRepo.update({
      start_time: newDate,
      room_id: roomId,
      lawyer_joined_at: newDate,
      session_id: input.sessionId,
      status: "ongoing",
    });
    if (!session) throw new Error("session start failed");
    return {
      amount: session.amount,
      appointment_id: session.appointment_id,
      client_id: session.client_id,
      createdAt: session.createdAt,
      duration: session.duration,
      id: session.id,
      lawyer_id: session.lawyer_id,
      reason: session.reason,
      scheduled_date: session.scheduled_date,
      scheduled_time: session.scheduled_time,
      status: session.status,
      type: session.type,
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
  }
}
