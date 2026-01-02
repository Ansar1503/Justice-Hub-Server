"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleStripeHookUseCase = void 0;
const stripe_service_1 = require("@src/application/services/stripe.service");
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
const Appointment_1 = require("@domain/entities/Appointment");
const Case_1 = require("@domain/entities/Case");
const CommissionTransaction_1 = require("@domain/entities/CommissionTransaction");
const PaymentsEntity_1 = require("@domain/entities/PaymentsEntity");
class HandleStripeHookUseCase {
    _scheduleSettingsRepo;
    _unitofwork;
    constructor(_scheduleSettingsRepo, _unitofwork) {
        this._scheduleSettingsRepo = _scheduleSettingsRepo;
        this._unitofwork = _unitofwork;
    }
    async execute(input) {
        const { body, signature } = input;
        const result = await (0, stripe_service_1.handleStripeWebHook)(body, signature);
        if (!result.eventHandled)
            return;
        const { lawyer_id, client_id, date, time, duration, payment_status, amountPaid, reason, title, caseTypeId, commissionAmount, commissionPercent, lawyerAmount, bookingType, subscriptionDiscountAmount, followupDiscountAmount, baseAmount, paymentIntentId, } = result;
        if (payment_status === "success") {
            if (bookingType === "initial") {
                if (client_id == null ||
                    lawyer_id == null ||
                    date == null ||
                    time == null ||
                    duration == null ||
                    payment_status == null ||
                    amountPaid == null ||
                    caseTypeId == null ||
                    title == null ||
                    commissionAmount == null ||
                    commissionPercent == null ||
                    lawyerAmount == null ||
                    bookingType == null ||
                    baseAmount == null ||
                    paymentIntentId == null) {
                    throw new Error("no metadata found");
                }
                const scheduleSettings = await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
                let status = "pending";
                if (scheduleSettings && scheduleSettings.autoConfirm) {
                    status = "confirmed";
                }
                this._unitofwork.startTransaction(async (uow) => {
                    const casepayload = Case_1.Case.create({
                        caseType: caseTypeId,
                        clientId: client_id,
                        lawyerId: lawyer_id,
                        title: title,
                        summary: reason,
                    });
                    await uow.caseRepo.create(casepayload);
                    const appointmentPayload = Appointment_1.Appointment.create({
                        amount: Number(amountPaid),
                        client_id: client_id,
                        date: new Date(date),
                        caseId: casepayload.id,
                        payment_status: payment_status,
                        duration: Number(duration),
                        lawyer_id: lawyer_id,
                        reason: reason || "",
                        time: time,
                        type: "consultation",
                    });
                    const appointment = await uow.appointmentRepo.createWithTransaction(appointmentPayload);
                    if (!appointment) {
                        throw new Error("Appointment update failed");
                    }
                    const wallet = await uow.walletRepo.getAdminWallet();
                    if (!wallet) {
                        throw new Error("lawyer wallet not found");
                    }
                    const desc = (0, WalletDescriptionsHelper_1.generateDescription)({
                        amount: appointment.amount,
                        category: "transfer",
                        type: "credit",
                    });
                    wallet.updateBalance(wallet.balance + appointment.amount);
                    try {
                        await uow.walletRepo.updateBalance(wallet.user_id, wallet.balance);
                    }
                    catch (error) {
                        console.log("error updating wallet balance", error);
                    }
                    const transaction = WalletTransactions_1.WalletTransaction.create({
                        amount: appointment.amount,
                        category: "transfer",
                        description: desc,
                        status: "completed",
                        type: "credit",
                        walletId: wallet.id,
                    });
                    try {
                        await uow.transactionsRepo.create(transaction);
                    }
                    catch (error) {
                        console.log("error creating transaction", error);
                    }
                    const commissionTransactionpayload = CommissionTransaction_1.CommissionTransaction.create({
                        amountPaid: amountPaid,
                        bookingId: appointment.bookingId,
                        clientId: client_id,
                        commissionPercent: commissionPercent,
                        lawyerId: lawyer_id,
                        commissionAmount,
                        lawyerAmount,
                        type: bookingType,
                        baseFee: baseAmount,
                        subscriptionDiscount: subscriptionDiscountAmount,
                        followupDiscount: followupDiscountAmount,
                    });
                    await uow.commissionTransactionRepo.create(commissionTransactionpayload);
                    const newPayments = PaymentsEntity_1.Payment.create({
                        amount: Number(amountPaid),
                        clientId: client_id,
                        currency: "INR",
                        paidFor: "appointment",
                        provider: "stripe",
                        providerRefId: paymentIntentId,
                        referenceId: appointment.bookingId,
                    });
                    newPayments.updateStatus("paid");
                    await uow.paymentRepo.create(newPayments);
                });
            }
            else if (bookingType === "followup") {
                const { caseId } = result;
                if (client_id == null ||
                    lawyer_id == null ||
                    date == null ||
                    time == null ||
                    duration == null ||
                    payment_status == null ||
                    amountPaid == null ||
                    caseId == null ||
                    commissionAmount == null ||
                    commissionPercent == null ||
                    lawyerAmount == null ||
                    bookingType == null ||
                    baseAmount == null ||
                    paymentIntentId == null) {
                    throw new Error("no metadata found for follow-up");
                }
                const scheduleSettings = await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
                let status = "pending";
                if (scheduleSettings && scheduleSettings.autoConfirm) {
                    status = "confirmed";
                }
                this._unitofwork.startTransaction(async (uow) => {
                    const caseRecord = await uow.caseRepo.findById(caseId);
                    if (!caseRecord)
                        throw new Error("Case not found for follow-up");
                    const appointmentPayload = Appointment_1.Appointment.create({
                        amount: Number(amountPaid),
                        client_id,
                        date: new Date(date),
                        caseId: caseRecord.id,
                        payment_status,
                        duration: Number(duration),
                        lawyer_id,
                        reason: reason || "",
                        time,
                        type: "consultation",
                    });
                    const appointment = await uow.appointmentRepo.createWithTransaction(appointmentPayload);
                    if (!appointment)
                        throw new Error("Appointment creation failed");
                    const wallet = await uow.walletRepo.getAdminWallet();
                    if (!wallet)
                        throw new Error("Admin wallet not found");
                    const desc = (0, WalletDescriptionsHelper_1.generateDescription)({
                        amount: appointment.amount,
                        category: "transfer",
                        type: "credit",
                    });
                    wallet.updateBalance(wallet.balance + appointment.amount);
                    await uow.walletRepo
                        .updateBalance(wallet.user_id, wallet.balance)
                        .catch(console.log);
                    const transaction = WalletTransactions_1.WalletTransaction.create({
                        amount: appointment.amount,
                        category: "transfer",
                        description: desc,
                        status: "completed",
                        type: "credit",
                        walletId: wallet.id,
                    });
                    await uow.transactionsRepo.create(transaction).catch(console.log);
                    const commissionTransactionPayload = CommissionTransaction_1.CommissionTransaction.create({
                        amountPaid,
                        bookingId: appointment.bookingId,
                        clientId: client_id,
                        commissionPercent,
                        lawyerId: lawyer_id,
                        commissionAmount,
                        lawyerAmount,
                        type: bookingType,
                        baseFee: baseAmount,
                        subscriptionDiscount: subscriptionDiscountAmount,
                        followupDiscount: followupDiscountAmount,
                    });
                    await uow.commissionTransactionRepo.create(commissionTransactionPayload);
                    const newPayments = PaymentsEntity_1.Payment.create({
                        amount: Number(amountPaid),
                        clientId: client_id,
                        currency: "INR",
                        paidFor: "appointment",
                        provider: "stripe",
                        providerRefId: paymentIntentId,
                        referenceId: appointment.bookingId,
                    });
                    newPayments.updateStatus("paid");
                    await uow.paymentRepo.create(newPayments);
                });
            }
        }
    }
}
exports.HandleStripeHookUseCase = HandleStripeHookUseCase;
