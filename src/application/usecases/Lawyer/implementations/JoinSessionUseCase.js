"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinSessionUseCase = void 0;
const ZegoCloud_service_1 = require("@src/application/services/ZegoCloud.service");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
class JoinSessionUseCase {
    _sessionsRepo;
    _appointmentRepo;
    userRepo;
    constructor(_sessionsRepo, _appointmentRepo, userRepo) {
        this._sessionsRepo = _sessionsRepo;
        this._appointmentRepo = _appointmentRepo;
        this.userRepo = userRepo;
    }
    async execute(input) {
        const existingSession = await this._sessionsRepo.findById({
            session_id: input.sessionId,
        });
        const user = await this.userRepo.findByuser_id(input.userId);
        if (!existingSession)
            throw new CustomError_1.ValidationError("session not found");
        const appointmentDetails = await this._appointmentRepo.findByBookingId(existingSession.bookingId);
        if (!appointmentDetails)
            throw new Error("Appointment not found");
        switch (existingSession.status) {
            case "cancelled":
                throw new CustomError_1.ValidationError("Session is cancelled");
            case "completed":
                throw new CustomError_1.ValidationError("Session is completed");
            case "missed":
                throw new CustomError_1.ValidationError("Session is missed");
            default:
                break;
        }
        const slotDateTime = (0, DateAndTimeHelper_1.timeStringToDate)(appointmentDetails.date, appointmentDetails.time);
        const newDate = new Date();
        if (newDate < slotDateTime) {
            throw new CustomError_1.ValidationError("Scheduled time is not reached");
        }
        slotDateTime.setMinutes(slotDateTime.getMinutes() + appointmentDetails.duration + 5);
        if (newDate > slotDateTime)
            throw new CustomError_1.ValidationError("session time is over");
        // console.log("sessssion", existingSession.);
        const { appId, token } = await (0, ZegoCloud_service_1.createToken)({
            userId: user?.role === "client"
                ? existingSession.client_id
                : existingSession.lawyer_id,
            roomId: existingSession.room_id,
            expiry: appointmentDetails.duration * 60,
        });
        if (appId && token && !existingSession.client_joined_at) {
            await this._sessionsRepo.update({
                session_id: existingSession.id,
                client_joined_at: new Date(),
            });
        }
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
exports.JoinSessionUseCase = JoinSessionUseCase;
