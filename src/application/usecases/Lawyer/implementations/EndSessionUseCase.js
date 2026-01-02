"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndSessionUseCase = void 0;
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
class EndSessionUseCase {
    _uow;
    constructor(_uow) {
        this._uow = _uow;
    }
    async execute(input) {
        return await this._uow.startTransaction(async (uow) => {
            const session = await uow.sessionRepo.findById({
                session_id: input.sessionId,
            });
            if (!session)
                throw new CustomError_1.ValidationError("Session not found");
            const appointmentDetails = await uow.appointmentRepo.findByBookingId(session.bookingId);
            if (!appointmentDetails)
                throw new Error("appointment not found");
            switch (session.status) {
                case "cancelled":
                    throw new CustomError_1.ValidationError("Session has been cancelled");
                case "completed":
                    throw new CustomError_1.ValidationError("Session has been completed");
                case "missed":
                    throw new CustomError_1.ValidationError("Session has been missed");
                case "upcoming":
                    throw new CustomError_1.ValidationError("session has not started yet");
            }
            const sessionStartAt = (0, DateAndTimeHelper_1.timeStringToDate)(appointmentDetails?.date, appointmentDetails.time);
            const currentDate = new Date();
            if (currentDate < sessionStartAt) {
                throw new CustomError_1.ValidationError("Session has not started yet");
            }
            const durationInMinutes = session.start_time
                ? Math.floor((currentDate.getTime() - session.start_time.getTime()) / (1000 * 60))
                : 0;
            const updatedSession = await uow.sessionRepo.update({
                session_id: input.sessionId,
                lawyer_left_at: currentDate,
                client_left_at: currentDate,
                room_id: "",
                end_time: currentDate,
                callDuration: durationInMinutes,
                status: "completed",
            });
            if (!updatedSession)
                throw new Error("End Session Failed");
            const commissionTransaction = await uow.commissionTransactionRepo.findByBookingId(appointmentDetails.bookingId);
            if (!commissionTransaction)
                throw new Error("no commission transaction recorded");
            const adminWallet = await uow.walletRepo.getAdminWallet();
            if (!adminWallet)
                throw new Error("admin wallet not found");
            const lawyerWallet = await uow.walletRepo.getWalletByUserId(appointmentDetails.lawyer_id);
            if (!lawyerWallet)
                throw new Error("no lawyer wallet found");
            //   lawyer transaction
            const lawyerDesc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: commissionTransaction.lawyerAmount,
                category: "transfer",
                type: "credit",
            });
            const lawyerWaletTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: commissionTransaction.lawyerAmount,
                category: "transfer",
                description: lawyerDesc,
                status: "completed",
                type: "credit",
                walletId: lawyerWallet.id,
            });
            await uow.transactionsRepo.create(lawyerWaletTransaction);
            // admmmin transaction
            const admindesc = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: commissionTransaction.lawyerAmount,
                category: "transfer",
                type: "debit",
            });
            const adminTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: commissionTransaction.lawyerAmount,
                category: "transfer",
                description: admindesc,
                status: "completed",
                type: "debit",
                walletId: adminWallet.id,
            });
            await uow.transactionsRepo.create(adminTransaction);
            await uow.commissionTransactionRepo.update({
                id: commissionTransaction.id,
                status: "credited",
            });
            await uow.walletRepo.updateBalance(lawyerWallet.user_id, lawyerWallet.balance + commissionTransaction.lawyerAmount);
            if (adminWallet.balance < commissionTransaction.lawyerAmount) {
                throw new Error("Admin wallet balance insufficient to pay lawyer");
            }
            await uow.walletRepo.updateBalance(adminWallet.user_id, Math.max(0, adminWallet.balance - commissionTransaction.lawyerAmount));
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
        });
    }
}
exports.EndSessionUseCase = EndSessionUseCase;
