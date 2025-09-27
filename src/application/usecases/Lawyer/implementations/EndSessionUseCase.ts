import { CancelSessionOutputDto } from "@src/application/dtos/Lawyer/CancelSessionDto";
import { IEndSessionUseCase } from "../IEndSessionUseCase";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { ICallLogs } from "@domain/IRepository/ICallLogs";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";

export class EndSessionUseCase implements IEndSessionUseCase {
    constructor(
    private _sessionsRepo: ISessionsRepo,
    private _callLogsRepo: ICallLogs,
    private _appointmentRepo: IAppointmentsRepository
    ) {}
    async execute(input: { sessionId: string }): Promise<CancelSessionOutputDto> {
        const session = await this._sessionsRepo.findById({
            session_id: input.sessionId,
        });
        if (!session) throw new ValidationError("Session not found");
        const appointmentDetails = await this._appointmentRepo.findByBookingId(
            session.bookingId
        );
        if (!appointmentDetails) throw new Error("appointment not found");
        switch (session.status) {
        case "cancelled":
            throw new ValidationError("Session has been cancelled");
        case "completed":
            throw new ValidationError("Session has been completed");
        case "missed":
            throw new ValidationError("Session has been missed");
        case "upcoming":
            throw new ValidationError("session has not started yet");
        }
        const sessionStartAt = timeStringToDate(
            appointmentDetails?.date,
            appointmentDetails.time
        );
        const currentDate = new Date();
        // if (currentDate < sessionStartAt) {
        //   throw new ValidationError("Session has not started yet");
        // }
        const durationInMinutes = session.start_time
            ? Math.floor(
                (currentDate.getTime() - session.start_time.getTime()) / (1000 * 60)
            )
            : 0;

        const updatedSession = await this._sessionsRepo.update({
            session_id: input.sessionId,
            lawyer_left_at: currentDate,
            room_id: "",
            end_time: currentDate,
            callDuration: durationInMinutes,
            status: "completed",
            end_reason: "session completed",
        });
        if (!updatedSession) throw new Error("End Session Failed");
        await this._callLogsRepo.updateByRoomId({
            roomId: session?.room_id,
            lawyer_left_at: currentDate,
            end_time: currentDate,
            status: "completed",
            callDuration: durationInMinutes,
            end_reason: "session completed",
        });
        return {
            bookingId: updatedSession.bookingId,
            caseId: updatedSession.caseId,
            end_reason: updatedSession.end_reason,
            appointment_id: updatedSession.appointment_id,
            client_id: updatedSession.client_id,
            createdAt: updatedSession.createdAt,
            id: updatedSession.id,
            lawyer_id: updatedSession.lawyer_id,
            status: updatedSession.status,
            updatedAt: updatedSession.updatedAt,
            callDuration: updatedSession.callDuration,
            client_joined_at: updatedSession.client_joined_at,
            client_left_at: updatedSession.client_left_at,
            end_time: updatedSession.end_time,
            follow_up_session_id: updatedSession.follow_up_session_id,
            follow_up_suggested: updatedSession.follow_up_suggested,
            lawyer_joined_at: updatedSession.lawyer_joined_at,
            lawyer_left_at: updatedSession.lawyer_left_at,
            notes: updatedSession.notes,
            room_id: updatedSession.room_id,
            start_time: updatedSession.start_time,
            summary: updatedSession.summary,
        };
    }
}
