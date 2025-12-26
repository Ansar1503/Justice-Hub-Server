import { STATUS_CODES } from "http";
import {
    ChangeAppointmentStatusInputDto,
    ChangeAppointmentStatusOutputDto,
} from "@src/application/dtos/Lawyer/ChangeAppointmentStatusDto";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { Session } from "@domain/entities/Session";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ChatSession } from "@domain/entities/ChatSession";
import { IChatSessionRepo } from "@domain/IRepository/IChatSessionRepo";
import { IConfirmAppointmentUseCase } from "../IConfirmAppointmentUseCase";

export class ConfirmAppointmentUseCase implements IConfirmAppointmentUseCase {
    constructor(
        private _appointmentRepo: IAppointmentsRepository,
        private _sessionRepo: ISessionsRepo,
        private _userRepo: IUserRepository,
        private _chatRepo: IChatSessionRepo,
    ) {}
    async execute(input: ChangeAppointmentStatusInputDto): Promise<ChangeAppointmentStatusOutputDto> {
        const appointment = await this._appointmentRepo.findById(input.id);
        if (!appointment) {
            const error: any = new Error("appointment not found");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "cancelled") {
            const error: any = new Error("already rejected");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "completed") {
            const error: any = new Error("appointment completed");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.status === "rejected") {
            const error: any = new Error("appointment already rejected by lawyer");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        if (appointment.payment_status !== "success") {
            const error: any = new Error("payment not completed");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const slotDateTime = timeStringToDate(appointment.date, appointment.time);

        if (slotDateTime <= new Date()) {
            const error: any = new Error("Date and time has reached or exceeded");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const sessionPayload = Session.create({
            appointment_id: input.id,
            client_id: appointment.client_id,
            lawyer_id: appointment.lawyer_id,
            status: "upcoming",
            bookingId: appointment.bookingId,
            caseId: appointment.caseId,
        });
        const newsession = await this._sessionRepo.create(sessionPayload);

        if (!newsession || !newsession.id) {
            const error: any = new Error("failed to create session");
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        const lawyer = await this._userRepo.findByuser_id(newsession.lawyer_id);
        const response = await this._appointmentRepo.updateWithId(input);
        if (!response) throw new Error("session creation failed");
        const chatSessionpayload = ChatSession.create({
            last_message: "",
            name: `${lawyer?.name}-${appointment.bookingId}`,
            participants: {
                client_id: newsession.client_id,
                lawyer_id: newsession.lawyer_id,
            },
            session_id: newsession.id,
        });
        await this._chatRepo.create(chatSessionpayload);
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
