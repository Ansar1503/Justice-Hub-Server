"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSessionUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
class CancelSessionUseCase {
    _sessionsRepo;
    _appointmentRepo;
    _uow;
    constructor(_sessionsRepo, _appointmentRepo, _uow) {
        this._sessionsRepo = _sessionsRepo;
        this._appointmentRepo = _appointmentRepo;
        this._uow = _uow;
    }
    async execute(input) {
        const sessionExist = await this._sessionsRepo.findById({
            session_id: input.session_id,
        });
        if (!sessionExist) {
            throw new CustomError_1.NotFoundError("Session not found");
        }
        const appointmentDetails = await this._appointmentRepo.findByBookingId(sessionExist.bookingId);
        if (!appointmentDetails)
            throw new Error("Appointment does not exists");
        const sessionStartAt = (0, DateAndTimeHelper_1.timeStringToDate)(appointmentDetails.date, appointmentDetails.time);
        const currentDate = new Date();
        if (currentDate > sessionStartAt) {
            throw new CustomError_1.ValidationError("Session has already started!");
        }
        return this._uow.startTransaction(async (uow) => {
            // console.log("sessionExist", sessionExist);
            const clientWallet = await uow.walletRepo.getWalletByUserId(appointmentDetails.client_id);
            if (!clientWallet)
                throw new Error("no client wallet found to refund");
            const adminWallet = await uow.walletRepo.getAdminWallet();
            if (!adminWallet)
                throw new Error("admin wallet not found");
            const updated = await uow.sessionRepo.update({
                session_id: input.session_id,
                status: "cancelled",
            });
            const walletUpdateAdmin = await uow.walletRepo.updateBalance(adminWallet.user_id, adminWallet.balance - appointmentDetails.amount);
            if (walletUpdateAdmin?.balance && walletUpdateAdmin.balance < 0) {
                throw new Error("Invalid wallet balance");
            }
            const admindesc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: appointmentDetails.amount,
                category: "refund",
                type: "debit",
            });
            const clientDesc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: appointmentDetails.amount,
                category: "refund",
                type: "credit",
            });
            const adminTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: appointmentDetails.amount,
                category: "refund",
                description: admindesc,
                status: "completed",
                type: "debit",
                walletId: adminWallet.id,
            });
            const clientTransaction = await WalletTransactions_1.WalletTransaction.create({
                amount: appointmentDetails.amount,
                category: "refund",
                description: clientDesc,
                status: "completed",
                type: "credit",
                walletId: clientWallet.id,
            });
            await uow.transactionsRepo.create(adminTransaction);
            await uow.transactionsRepo.create(clientTransaction);
            const commissionTransaction = await uow.commissionTransactionRepo.findByBookingId(appointmentDetails.bookingId);
            if (!commissionTransaction) {
                throw new Error("commission transaction failed");
            }
            await uow.commissionTransactionRepo.update({
                id: commissionTransaction.id,
                status: "failed",
            });
            await uow.walletRepo.updateBalance(clientWallet.user_id, clientWallet.balance + appointmentDetails.amount);
            if (!updated)
                throw new Error("cancelation failed");
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
exports.CancelSessionUseCase = CancelSessionUseCase;
