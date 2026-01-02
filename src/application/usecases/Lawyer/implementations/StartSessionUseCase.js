"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartSessionUseCase = void 0;
const crypto_1 = require("crypto");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const ZegoCloud_service_1 = require("@src/application/services/ZegoCloud.service");
class StartSessionUseCase {
    _sessionsRepo;
    _appointmentDetails;
    _uow;
    constructor(_sessionsRepo, _appointmentDetails, _uow) {
        this._sessionsRepo = _sessionsRepo;
        this._appointmentDetails = _appointmentDetails;
        this._uow = _uow;
    }
    async execute(input) {
        const existingSession = await this._sessionsRepo.findById({
            session_id: input.sessionId,
        });
        if (!existingSession)
            throw new CustomError_1.ValidationError("session not found");
        const appointmentDetails = await this._appointmentDetails.findByBookingId(existingSession.bookingId);
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
        const roomId = `Room_${(0, crypto_1.randomUUID)()}`;
        const { appId, token } = await (0, ZegoCloud_service_1.createToken)({
            userId: existingSession.lawyer_id,
            roomId: roomId,
            expiry: appointmentDetails?.duration * 60,
        });
        return this._uow.startTransaction(async (uow) => {
            const session = await uow.sessionRepo.update({
                start_time: newDate,
                room_id: roomId,
                lawyer_joined_at: newDate,
                session_id: input.sessionId,
                status: "ongoing",
            });
            if (!session)
                throw new Error("session start failed");
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
exports.StartSessionUseCase = StartSessionUseCase;
