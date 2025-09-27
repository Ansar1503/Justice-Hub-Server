import { CancelSessionInputDto, CancelSessionOutputDto } from "@src/application/dtos/Lawyer/CancelSessionDto";
import { NotFoundError, ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { timeStringToDate } from "@shared/utils/helpers/DateAndTimeHelper";
import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
import { ICancelSessionUseCase } from "../ICancellSessionUseCase";

export class CancelSessionUseCase implements ICancelSessionUseCase {
    constructor(
        private _sessionsRepo: ISessionsRepo,
        private _appointmentRepo: IAppointmentsRepository,
        private _uow: IUnitofWork,
    ) {}
    async execute(input: CancelSessionInputDto): Promise<CancelSessionOutputDto> {
        const sessionExist = await this._sessionsRepo.findById({
            session_id: input.session_id,
        });
        if (!sessionExist) {
            throw new NotFoundError("Session not found");
        }
        const appointmentDetails = await this._appointmentRepo.findByBookingId(sessionExist.bookingId);
        if (!appointmentDetails) throw new Error("Appointment does not exists");
        const sessionStartAt = timeStringToDate(appointmentDetails.date, appointmentDetails.time);
        const currentDate = new Date();
        if (currentDate > sessionStartAt) {
            throw new ValidationError("Session has already started!");
        }

        return this._uow.startTransaction(async (uow) => {
            // console.log("sessionExist", sessionExist);
            const clientWallet = await uow.walletRepo.getWalletByUserId(appointmentDetails.client_id);
            if (!clientWallet) throw new Error("no client wallet found to refund");
            const adminWallet = await uow.walletRepo.getAdminWallet();
            if (!adminWallet) throw new Error("admin wallet not found");
            const updated = await uow.sessionRepo.update({
                session_id: input.session_id,
                status: "cancelled",
            });
            const walletUpdateAdmin = await uow.walletRepo.updateBalance(
                adminWallet.user_id,
                adminWallet.balance - appointmentDetails.amount,
            );
            if (walletUpdateAdmin?.balance && walletUpdateAdmin.balance < 0) {
                throw new Error("Invalid wallet balance");
            }
            const admindesc = generateDescription({
                amount: appointmentDetails.amount,
                category: "refund",
                type: "debit",
            });
            const clientDesc = generateDescription({
                amount: appointmentDetails.amount,
                category: "refund",
                type: "credit",
            });
            const adminTransaction = WalletTransaction.create({
                amount: appointmentDetails.amount,
                category: "refund",
                description: admindesc,
                status: "completed",
                type: "debit",
                walletId: adminWallet.id,
            });
            const clientTransaction = await WalletTransaction.create({
                amount: appointmentDetails.amount,
                category: "refund",
                description: clientDesc,
                status: "completed",
                type: "credit",
                walletId: clientWallet.id,
            });
            await uow.transactionsRepo.create(adminTransaction);
            await uow.transactionsRepo.create(clientTransaction);
            await uow.walletRepo.updateBalance(clientWallet.user_id, clientWallet.balance + appointmentDetails.amount);
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
        });
    }
}
