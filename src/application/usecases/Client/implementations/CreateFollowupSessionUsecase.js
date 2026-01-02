"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFollowupCheckoutSessionUsecase = void 0;
const errors_1 = require("@infrastructure/constant/errors");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const status_codes_1 = require("@infrastructure/constant/status.codes");
const GetAppointmentKey_1 = require("@shared/utils/helpers/GetAppointmentKey");
const stripe_service_1 = require("@src/application/services/stripe.service");
const date_fns_1 = require("date-fns");
class CreateFollowupCheckoutSessionUsecase {
    _userRepository;
    _lawyerVerificationRepository;
    _appointmentRepo;
    _scheduleSettingsRepo;
    _availableSlotsRepo;
    _overrideSlotsRepo;
    _walletRepo;
    _lawyerRepo;
    _redisService;
    _commissionSettingsRepo;
    _userSubscriptionRepo;
    constructor(_userRepository, _lawyerVerificationRepository, _appointmentRepo, _scheduleSettingsRepo, _availableSlotsRepo, _overrideSlotsRepo, _walletRepo, _lawyerRepo, _redisService, _commissionSettingsRepo, _userSubscriptionRepo) {
        this._userRepository = _userRepository;
        this._lawyerVerificationRepository = _lawyerVerificationRepository;
        this._appointmentRepo = _appointmentRepo;
        this._scheduleSettingsRepo = _scheduleSettingsRepo;
        this._availableSlotsRepo = _availableSlotsRepo;
        this._overrideSlotsRepo = _overrideSlotsRepo;
        this._walletRepo = _walletRepo;
        this._lawyerRepo = _lawyerRepo;
        this._redisService = _redisService;
        this._commissionSettingsRepo = _commissionSettingsRepo;
        this._userSubscriptionRepo = _userSubscriptionRepo;
    }
    async execute(input) {
        const { client_id, date, duration, lawyer_id, reason, timeSlot } = input;
        const user = await this._userRepository.findByuser_id(lawyer_id);
        if (!user)
            throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
        if (user.is_blocked)
            throw new Error(errors_1.ERRORS.USER_BLOCKED);
        const lawyerVerificaitionDetails = await this._lawyerVerificationRepository.findByUserId(lawyer_id);
        const lawyerDetails = await this._lawyerRepo.findUserId(lawyer_id);
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
        const slotSettings = await this._scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
        const commissionSettings = await this._commissionSettingsRepo.fetchCommissionSettings();
        if (!commissionSettings)
            throw new Error("Commission settings not set by Admin");
        const baseFee = lawyerDetails.consultationFee;
        const commissionPercent = commissionSettings.followupCommission;
        const discountAmount = Math.round((lawyerDetails.consultationFee *
            (commissionSettings.initialCommission - commissionPercent)) /
            100);
        const followupDiscount = discountAmount;
        let amountPaid = baseFee - followupDiscount;
        const userSubs = await this._userSubscriptionRepo.findByUser(client_id);
        const subscriptionDiscountPercent = userSubs?.benefitsSnapshot?.discountPercent ?? 0;
        let subscriptionDiscountAmount = 0;
        if (subscriptionDiscountPercent > 0) {
            subscriptionDiscountAmount = Math.round((amountPaid * subscriptionDiscountPercent) / 100);
            amountPaid -= subscriptionDiscountAmount;
        }
        amountPaid = Math.max(0, amountPaid);
        const commissionAmount = Math.round((amountPaid * commissionPercent) / 100);
        const lawyerAmount = amountPaid - commissionAmount;
        if (!slotSettings) {
            const error = new Error("slot settings not found for the lawyer");
            error.code = 404;
            throw error;
        }
        const wallet = await this._walletRepo.getWalletByUserId(lawyer_id);
        if (!wallet) {
            throw new Error("wallet not found for the lawyer");
        }
        const availableSlots = await this._availableSlotsRepo.findAvailableSlots(lawyer_id);
        if (!availableSlots) {
            const error = new Error("No available slots found for the lawyer");
            error.code = 404;
            throw error;
        }
        const override = await this._overrideSlotsRepo.fetcghOverrideSlotByDate(lawyer_id, date);
        const appointment = await this._appointmentRepo.findByDateandLawyer_id({
            lawyer_id,
            date,
        });
        const timeSlotExist = appointment?.some((appointment) => appointment.time === timeSlot && appointment.payment_status !== "failed");
        if (timeSlotExist) {
            const error = new Error("slot already booked");
            error.code = 404;
            throw error;
        }
        const existingApointmentonDate = await this._appointmentRepo.findByDateandClientId({ client_id, date });
        const bookingExist = existingApointmentonDate?.some((appointment) => appointment.time === timeSlot && appointment.payment_status !== "failed");
        const existingApps = await this._appointmentRepo.findByClientID(client_id);
        if (userSubs?.benefitsSnapshot.bookingsPerMonth &&
            userSubs?.benefitsSnapshot?.bookingsPerMonth !== "unlimited" &&
            userSubs?.benefitsSnapshot?.bookingsPerMonth > 0) {
            const monthStart = (0, date_fns_1.startOfMonth)(new Date());
            const monthEnd = (0, date_fns_1.endOfMonth)(new Date());
            const existingAppsOnMonth = existingApps.filter((a) => a.date >= monthStart &&
                a.date <= monthEnd &&
                a.status !== "cancelled" &&
                a.status !== "rejected");
            if (existingAppsOnMonth.length >=
                userSubs?.benefitsSnapshot?.bookingsPerMonth) {
                throw new Error("Number of booking exceeded");
            }
        }
        let numberOfCancel;
        if (existingApps && existingApps.length > 0) {
            numberOfCancel = existingApps.filter((a) => a.status == "cancelled").length;
        }
        if (numberOfCancel && numberOfCancel >= 2)
            throw new Error("Number of cancellation exceeded");
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
                const newappointment = {
                    amount: amountPaid,
                    client_id,
                    date,
                    duration,
                    lawyer_id,
                    reason,
                    time: timeSlot,
                    type: "consultation",
                };
                const key = (0, GetAppointmentKey_1.GetAppointmentRedisKey)(lawyer_id, date, timeSlot);
                const isLocked = await this._redisService.setWithNx(key, JSON.stringify(newappointment), 60 * 10);
                if (!isLocked)
                    throw new Error("Slot already temporarily reserved, please choose another.");
                const stripe = await (0, stripe_service_1.getFollowupStripeSession)({
                    amountPaid: amountPaid,
                    date: String(date),
                    lawyer_name: user.name,
                    slot: timeSlot,
                    userEmail: user.email,
                    lawyer_id,
                    duration,
                    client_id,
                    caseId: input.caseId,
                    reason: input.reason,
                    commissionAmount,
                    commissionPercent,
                    lawyerAmount,
                    bookingType: "followup",
                    subscriptionDiscountAmount,
                    followupDiscountAmount: followupDiscount,
                    baseAmount: lawyerDetails.consultationFee,
                });
                return stripe;
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
        const newappointment = {
            amount: amountPaid,
            client_id,
            date,
            duration,
            lawyer_id,
            reason,
            time: timeSlot,
            type: "consultation",
        };
        const key = (0, GetAppointmentKey_1.GetAppointmentRedisKey)(lawyer_id, date, timeSlot);
        const isLocked = await this._redisService.setWithNx(key, JSON.stringify(newappointment), 60 * 10);
        if (!isLocked)
            throw new Error("Slot already temporarily reserved, please choose another.");
        const stripe = await (0, stripe_service_1.getFollowupStripeSession)({
            amountPaid: amountPaid,
            date: String(date),
            lawyer_name: user.name,
            slot: timeSlot,
            userEmail: user.email,
            lawyer_id,
            duration,
            client_id,
            caseId: input.caseId,
            reason: input.reason,
            commissionAmount,
            commissionPercent,
            lawyerAmount,
            bookingType: "followup",
            subscriptionDiscountAmount,
            followupDiscountAmount: followupDiscount,
            baseAmount: lawyerDetails.consultationFee,
        });
        return stripe;
    }
}
exports.CreateFollowupCheckoutSessionUsecase = CreateFollowupCheckoutSessionUsecase;
