"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectAppointmentUseCase = void 0;
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
const status_codes_1 = require("@infrastructure/constant/status.codes");
class RejectAppointmentUseCase {
    appointmentRepo;
    UnitofWork;
    constructor(appointmentRepo, UnitofWork) {
        this.appointmentRepo = appointmentRepo;
        this.UnitofWork = UnitofWork;
    }
    async execute(input) {
        return await this.UnitofWork.startTransaction(async (uow) => {
            const appointment = await this.appointmentRepo.findById(input.id);
            if (!appointment) {
                const error = new Error("appointment not found");
                error.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            if (appointment.status === "cancelled") {
                const error = new Error("already rejected");
                error.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            if (appointment.status === "completed") {
                const error = new Error("appointment completed");
                error.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            if (appointment.status === "rejected") {
                const error = new Error("appointment already rejected by lawyer");
                error.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            const clientWallet = await uow.walletRepo.getWalletByUserId(appointment.client_id);
            const adminWallet = await uow.walletRepo.getAdminWallet();
            if (!clientWallet)
                throw new Error("client wallet not found");
            if (!adminWallet)
                throw new Error("admin wallet not found");
            if (adminWallet.balance < appointment.amount) {
                throw new Error("insufficient balance in admin Wallet");
            }
            adminWallet.updateBalance(adminWallet.balance - appointment.amount);
            clientWallet.updateBalance(clientWallet.balance + appointment.amount);
            await uow.walletRepo.updateBalance(adminWallet.user_id, adminWallet.balance);
            await uow.walletRepo.updateBalance(clientWallet.user_id, clientWallet.balance);
            const adminTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: appointment.amount,
                type: "debit",
                category: "refund",
                description: (0, WalletDescriptionsHelper_1.generateDescription)({
                    amount: appointment.amount,
                    category: "refund",
                    type: "debit",
                }),
                status: "completed",
                walletId: adminWallet.id,
            });
            const clientTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: appointment.amount,
                type: "credit",
                category: "refund",
                description: (0, WalletDescriptionsHelper_1.generateDescription)({
                    amount: appointment.amount,
                    category: "refund",
                    type: "credit",
                }),
                status: "completed",
                walletId: clientWallet.id,
            });
            await uow.transactionsRepo.create(adminTransaction);
            await uow.transactionsRepo.create(clientTransaction);
            const response = await uow.appointmentRepo.updateWithId(input);
            if (!response)
                throw new Error("appointment cancellation failed");
            return {
                amount: response.amount,
                bookingId: response.bookingId,
                caseId: response.caseId,
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
        });
    }
}
exports.RejectAppointmentUseCase = RejectAppointmentUseCase;
