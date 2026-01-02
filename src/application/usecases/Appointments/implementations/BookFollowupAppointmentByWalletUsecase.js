"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFollowupAppointmentByWalletUsecase = void 0;
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const errors_1 = require("@infrastructure/constant/errors");
const status_codes_1 = require("@infrastructure/constant/status.codes");
const Appointment_1 = require("@domain/entities/Appointment");
const CommissionTransaction_1 = require("@domain/entities/CommissionTransaction");
const WalletDescriptionsHelper_1 = require("@shared/utils/helpers/WalletDescriptionsHelper");
const WalletTransactions_1 = require("@domain/entities/WalletTransactions");
class BookFollowupAppointmentByWalletUsecase {
    _uow;
    commissionSettingsRepo;
    constructor(_uow, commissionSettingsRepo) {
        this._uow = _uow;
        this.commissionSettingsRepo = commissionSettingsRepo;
    }
    async execute(input) {
        const { caseId, client_id, date, duration, lawyer_id, reason, timeSlot } = input;
        return this._uow.startTransaction(async (uow) => {
            const user = await uow.userRepo.findByuser_id(lawyer_id);
            if (!user)
                throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
            if (user.is_blocked)
                throw new Error(errors_1.ERRORS.USER_BLOCKED);
            const lawyerVerificaitionDetails = await uow.lawyerVerificationRepo.findByUserId(lawyer_id);
            const lawyerDetails = await uow.lawyerRepo.findUserId(lawyer_id);
            if (!lawyerDetails)
                throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
            if (!lawyerVerificaitionDetails)
                throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
            if (lawyerVerificaitionDetails.verificationStatus !== "verified")
                throw new Error(errors_1.ERRORS.LAWYER_NOT_VERIFIED);
            const slotDateTime = (0, DateAndTimeHelper_1.timeStringToDate)(date, timeSlot);
            if (slotDateTime <= new Date()) {
                const err = new Error("Selected time slot is in the past");
                err.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw err;
            }
            const slotSettings = await uow.scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
            if (!slotSettings) {
                const error = new Error("slot settings not found for the lawyer");
                error.code = 404;
                throw error;
            }
            const commissionSettings = await this.commissionSettingsRepo.fetchCommissionSettings();
            if (!commissionSettings) {
                const error = new Error("Commission settings not found");
                error.code = 404;
                throw error;
            }
            const myWallet = await uow.walletRepo.getWalletByUserId(client_id);
            if (!myWallet)
                throw new Error("wallet not found");
            const userSubs = await uow.userSubscriptionRepo.findByUser(client_id);
            const baseFee = lawyerDetails.consultationFee;
            const followupDiscount = Math.round((baseFee *
                (commissionSettings.initialCommission -
                    commissionSettings.followupCommission)) /
                100);
            let amountPaid = baseFee - followupDiscount;
            const subscriptionDiscountPercent = userSubs?.benefitsSnapshot?.discountPercent ?? 0;
            let subscriptionDiscountAmount = 0;
            if (subscriptionDiscountPercent > 0) {
                subscriptionDiscountAmount = Math.round((amountPaid * subscriptionDiscountPercent) / 100);
                amountPaid -= subscriptionDiscountAmount;
            }
            amountPaid = Math.max(0, amountPaid);
            if (myWallet.balance < amountPaid) {
                throw new Error("Insufficient balance");
            }
            const commissionPercent = commissionSettings.followupCommission;
            const commissionAmount = Math.round((amountPaid * commissionPercent) / 100);
            const lawyerAmount = amountPaid - commissionAmount;
            if (myWallet.balance < amountPaid) {
                throw new Error("Insufficient balance");
            }
            const availableSlots = await uow.availableSlotsRepo.findAvailableSlots(lawyer_id);
            if (!availableSlots) {
                const error = new Error("No available slots found for the lawyer");
                error.code = 404;
                throw error;
            }
            const override = await uow.overrideSlotsRepo.fetcghOverrideSlotByDate(lawyer_id, date);
            const appointment = await uow.appointmentRepo.findByDateandLawyer_id({
                lawyer_id,
                date,
            });
            const timeSlotExist = appointment?.some((appointment) => appointment.time === timeSlot &&
                appointment.payment_status !== "failed");
            if (timeSlotExist) {
                const error = new Error("slot already booked");
                error.code = 404;
                throw error;
            }
            const caseExists = await uow.caseRepo.findById(caseId);
            if (!caseExists)
                throw new Error("Case not Found");
            const existingApointmentonDate = await uow.appointmentRepo.findByDateandClientId({
                client_id,
                date,
            });
            const bookingExist = existingApointmentonDate?.some((appointment) => appointment.time === timeSlot &&
                appointment.payment_status !== "failed");
            if (bookingExist) {
                const error = new Error("you have booking on same time");
                error.code = status_codes_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            if (override && Object.keys(override).length > 0) {
                const overrideDate = override.overrideDates[0];
                if (overrideDate.isUnavailable) {
                    const error = new Error("lawyer is unavailble for the date");
                    error.code = 404;
                    throw error;
                }
                if (!overrideDate.timeRanges || overrideDate.timeRanges.length === 0) {
                    const error = new Error("No slots found for the date");
                    error.code = 404;
                    throw error;
                }
                if (overrideDate.timeRanges.length > 0) {
                    const timeRanges = overrideDate.timeRanges;
                    const bookTimeMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(timeSlot);
                    if (isNaN(bookTimeMins)) {
                        const error = new Error("Invalid time slot format");
                        error.code = 400;
                        throw error;
                    }
                    const isValidTime = timeRanges.some((range) => {
                        const startMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(range.start);
                        const endMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(range.end);
                        if (isNaN(startMins) || isNaN(endMins)) {
                            return false;
                        }
                        return bookTimeMins >= startMins && bookTimeMins <= endMins;
                    });
                    if (!isValidTime) {
                        const error = new Error("Time slots are not valid for the selected time slot");
                        error.code = 404;
                        throw error;
                    }
                    const newappointment = Appointment_1.Appointment.create({
                        amount: amountPaid,
                        caseId: caseId,
                        client_id,
                        date,
                        duration,
                        lawyer_id,
                        payment_status: "success",
                        reason,
                        time: timeSlot,
                        type: "follow-up",
                    });
                    const appointmentCreated = await uow.appointmentRepo.create(newappointment);
                    const adminWallet = await uow.walletRepo.getAdminWallet();
                    if (!adminWallet)
                        throw new Error("admins wallet not found");
                    const adminDescription = (0, WalletDescriptionsHelper_1.generateDescription)({
                        amount: amountPaid,
                        category: "transfer",
                        type: "credit",
                    });
                    const clientDescription = (0, WalletDescriptionsHelper_1.generateDescription)({
                        amount: amountPaid,
                        category: "transfer",
                        type: "debit",
                    });
                    const clientTransaction = WalletTransactions_1.WalletTransaction.create({
                        amount: amountPaid,
                        category: "transfer",
                        type: "debit",
                        description: clientDescription,
                        walletId: myWallet.id,
                        status: "completed",
                    });
                    const adminTransaction = WalletTransactions_1.WalletTransaction.create({
                        amount: amountPaid,
                        category: "transfer",
                        type: "credit",
                        description: adminDescription,
                        walletId: adminWallet.id,
                        status: "completed",
                    });
                    await uow.transactionsRepo.create(clientTransaction);
                    await uow.transactionsRepo.create(adminTransaction);
                    await uow.walletRepo.updateBalance(myWallet.user_id, Math.max(0, myWallet.balance - appointmentCreated.amount));
                    await uow.walletRepo.updateBalance(adminWallet.user_id, adminWallet.balance + appointmentCreated.amount);
                    const commissionTransaction = CommissionTransaction_1.CommissionTransaction.create({
                        amountPaid,
                        bookingId: appointmentCreated.bookingId,
                        clientId: client_id,
                        lawyerId: lawyer_id,
                        commissionPercent,
                        commissionAmount,
                        lawyerAmount,
                        type: "followup",
                        baseFee,
                        subscriptionDiscount: subscriptionDiscountAmount,
                        followupDiscount,
                    });
                    await uow.commissionTransactionRepo.create(commissionTransaction);
                    return {
                        amount: appointmentCreated.amount,
                        bookingId: appointmentCreated.bookingId,
                        caseId: appointmentCreated.caseId,
                        client_id: appointmentCreated.client_id,
                        createdAt: appointmentCreated.createdAt,
                        date: appointmentCreated.date,
                        duration: appointmentCreated.duration,
                        id: appointmentCreated.id,
                        lawyer_id: appointmentCreated.lawyer_id,
                        payment_status: appointmentCreated.payment_status,
                        reason: appointmentCreated.reason,
                        status: appointmentCreated.status,
                        time: appointmentCreated.time,
                        type: appointmentCreated.type,
                        updatedAt: appointmentCreated.updatedAt,
                    };
                }
            }
            const days = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ];
            const index = date.getDay();
            const day = days[index];
            if (!availableSlots.getDayAvailability(day)) {
                const error = new Error("No available slots found for the selected date");
                error.code = 404;
                throw error;
            }
            if (!availableSlots.getDayAvailability(day).enabled) {
                const error = new Error("Slots are not available for the selected date");
                error.code = 404;
                throw error;
            }
            const timeSlots = availableSlots.getDayAvailability(day).timeSlots;
            if (!timeSlots || timeSlots.length === 0) {
                const error = new Error("Slots are not available for the selected date");
                error.code = 404;
                throw error;
            }
            const bookTimeMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(timeSlot);
            const isValidTime = timeSlots.some((range) => {
                const startMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(range.start);
                const endMins = (0, DateAndTimeHelper_1.timeStringToMinutes)(range.end);
                if (isNaN(startMins) || isNaN(endMins)) {
                    return false;
                }
                return bookTimeMins >= startMins && bookTimeMins <= endMins;
            });
            if (!isValidTime) {
                const error = new Error("Invalid time slot");
                error.code = 404;
                throw error;
            }
            const newappointment = Appointment_1.Appointment.create({
                amount: amountPaid,
                caseId: caseId,
                client_id,
                date,
                duration,
                lawyer_id,
                payment_status: "success",
                reason,
                time: timeSlot,
                type: "follow-up",
            });
            const appointmentCreated = await uow.appointmentRepo.create(newappointment);
            const adminWallet = await uow.walletRepo.getAdminWallet();
            if (!adminWallet)
                throw new Error("Admin wallet not found");
            const adminDescription = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: amountPaid,
                category: "transfer",
                type: "credit",
            });
            const clientDescription = (0, WalletDescriptionsHelper_1.generateDescription)({
                amount: amountPaid,
                category: "transfer",
                type: "debit",
            });
            const clientTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: amountPaid,
                category: "transfer",
                type: "debit",
                description: clientDescription,
                walletId: myWallet.id,
                status: "completed",
            });
            const adminTransaction = WalletTransactions_1.WalletTransaction.create({
                amount: amountPaid,
                category: "transfer",
                type: "credit",
                description: adminDescription,
                walletId: adminWallet.id,
                status: "completed",
            });
            await uow.transactionsRepo.create(clientTransaction);
            await uow.transactionsRepo.create(adminTransaction);
            await uow.walletRepo.updateBalance(myWallet.user_id, Math.max(0, myWallet.balance - appointmentCreated.amount));
            await uow.walletRepo.updateBalance(adminWallet.user_id, adminWallet.balance + amountPaid);
            const commissionTransaction = CommissionTransaction_1.CommissionTransaction.create({
                amountPaid,
                bookingId: appointmentCreated.bookingId,
                clientId: client_id,
                lawyerId: lawyer_id,
                commissionPercent,
                commissionAmount,
                lawyerAmount,
                type: "followup",
                baseFee,
                subscriptionDiscount: subscriptionDiscountAmount,
                followupDiscount,
            });
            await uow.commissionTransactionRepo.create(commissionTransaction);
            return {
                amount: appointmentCreated.amount,
                bookingId: appointmentCreated.bookingId,
                caseId: appointmentCreated.caseId,
                client_id: appointmentCreated.client_id,
                createdAt: appointmentCreated.createdAt,
                date: appointmentCreated.date,
                duration: appointmentCreated.duration,
                id: appointmentCreated.id,
                lawyer_id: appointmentCreated.lawyer_id,
                payment_status: appointmentCreated.payment_status,
                reason: appointmentCreated.reason,
                status: appointmentCreated.status,
                time: appointmentCreated.time,
                type: appointmentCreated.type,
                updatedAt: appointmentCreated.updatedAt,
            };
        });
    }
}
exports.BookFollowupAppointmentByWalletUsecase = BookFollowupAppointmentByWalletUsecase;
