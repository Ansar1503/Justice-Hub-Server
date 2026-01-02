"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmAppointmentUseCase = void 0;
const http_1 = require("http");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const Session_1 = require("@domain/entities/Session");
const ChatSession_1 = require("@domain/entities/ChatSession");
class ConfirmAppointmentUseCase {
    appointmentRepo;
    sessionRepo;
    userRepo;
    chatRepo;
    constructor(appointmentRepo, sessionRepo, userRepo, chatRepo) {
        this.appointmentRepo = appointmentRepo;
        this.sessionRepo = sessionRepo;
        this.userRepo = userRepo;
        this.chatRepo = chatRepo;
    }
    async execute(input) {
        const appointment = await this.appointmentRepo.findById(input.id);
        if (!appointment) {
            const error = new Error("appointment not found");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "cancelled") {
            const error = new Error("already rejected");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "completed") {
            const error = new Error("appointment completed");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "rejected") {
            const error = new Error("appointment already rejected by lawyer");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.payment_status !== "success") {
            const error = new Error("payment not completed");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const slotDateTime = (0, DateAndTimeHelper_1.timeStringToDate)(appointment.date, appointment.time);
        if (slotDateTime <= new Date()) {
            const error = new Error("Date and time has reached or exceeded");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const sessionPayload = Session_1.Session.create({
            appointment_id: input.id,
            client_id: appointment.client_id,
            lawyer_id: appointment.lawyer_id,
            status: "upcoming",
            bookingId: appointment.bookingId,
            caseId: appointment.caseId,
        });
        const newsession = await this.sessionRepo.create(sessionPayload);
        if (!newsession || !newsession.id) {
            const error = new Error("failed to create session");
            error.code = http_1.STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const lawyer = await this.userRepo.findByuser_id(newsession.lawyer_id);
        const response = await this.appointmentRepo.updateWithId(input);
        if (!response)
            throw new Error("session creation failed");
        const chatSessionpayload = ChatSession_1.ChatSession.create({
            last_message: "",
            name: `${lawyer?.name}-${appointment.bookingId}`,
            participants: {
                client_id: newsession.client_id,
                lawyer_id: newsession.lawyer_id,
            },
            session_id: newsession.id,
        });
        await this.chatRepo.create(chatSessionpayload);
        return {
            bookingId: response.bookingId,
            caseId: response.caseId,
            amount: response.amount,
            client_id: response.client_id,
            createdAt: response.createdAt,
            date: response.date,
            duration: response.duration,
            id: response.id,
            lawyer_id: response.lawyer_id,
            payment_status: response.payment_status,
            reason: response.reason,
            status: response.status,
            time: response.time,
            type: response.type,
            updatedAt: response.updatedAt,
        };
    }
}
exports.ConfirmAppointmentUseCase = ConfirmAppointmentUseCase;
