"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerCalendarAvailabilityUseCase = void 0;
const date_fns_1 = require("date-fns");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const errors_1 = require("@infrastructure/constant/errors");
class FetchLawyerCalendarAvailabilityUseCase {
    userRepo;
    lawyerRepo;
    scheduleSettingsRepo;
    availabilityRepo;
    overrideRepo;
    appointmentRepo;
    constructor(userRepo, lawyerRepo, scheduleSettingsRepo, availabilityRepo, overrideRepo, appointmentRepo) {
        this.userRepo = userRepo;
        this.lawyerRepo = lawyerRepo;
        this.scheduleSettingsRepo = scheduleSettingsRepo;
        this.availabilityRepo = availabilityRepo;
        this.overrideRepo = overrideRepo;
        this.appointmentRepo = appointmentRepo;
    }
    async execute(input) {
        const { lawyerId, month } = input;
        const user = await this.userRepo.findByuser_id(lawyerId);
        if (!user)
            throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
        if (user.is_blocked)
            throw new Error(errors_1.ERRORS.USER_BLOCKED);
        const lawyer = await this.lawyerRepo.findByUserId(lawyerId);
        if (!lawyer || lawyer.verificationStatus !== "verified")
            throw new Error(errors_1.ERRORS.LAWYER_NOT_VERIFIED);
        const settings = await this.scheduleSettingsRepo.fetchScheduleSettings(lawyerId);
        const availability = await this.availabilityRepo.findAvailableSlots(lawyerId);
        const overrides = await this.overrideRepo.fetchOverrideSlots(lawyerId);
        if (!settings || !availability)
            throw new Error("Lawyer schedule/availability not found");
        const { slotDuration, maxDaysInAdvance } = settings;
        const baseDate = month ? new Date(`${month}-01`) : new Date();
        const monthStart = (0, date_fns_1.startOfMonth)(baseDate);
        const monthEnd = (0, date_fns_1.endOfMonth)(baseDate);
        const today = new Date();
        const appointments = await this.appointmentRepo.findAppointmentsByLawyerAndRange(lawyerId, monthStart, monthEnd);
        const allDates = (0, date_fns_1.eachDayOfInterval)({ start: monthStart, end: monthEnd });
        const availableDates = allDates
            .filter((d) => {
            const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= maxDaysInAdvance;
        })
            .map((date) => {
            const dateStr = date.toISOString().split("T")[0];
            const dayName = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
            ][date.getDay()];
            const dayAvailability = availability.getDayAvailability(dayName);
            let timeRanges = dayAvailability.timeSlots.map((t) => ({
                start: t.start,
                end: t.end,
            }));
            let isAvailable = dayAvailability.enabled;
            const overrideForDate = overrides?.overrideDates.find((ov) => new Date(ov.date).toDateString() === date.toDateString());
            if (overrideForDate) {
                if (overrideForDate.isUnavailable) {
                    isAvailable = false;
                    timeRanges = [];
                }
                else if (overrideForDate.timeRanges?.length) {
                    timeRanges = overrideForDate.timeRanges;
                    isAvailable = true;
                }
            }
            const bookedTimes = new Set(appointments
                .filter((appt) => new Date(appt.date).toDateString() === date.toDateString() &&
                appt.payment_status !== "failed")
                .map((appt) => appt.time));
            const timeRangeResults = timeRanges.map((range) => {
                const generatedSlots = (0, DateAndTimeHelper_1.generateTimeSlots)(range.start, range.end, slotDuration);
                const remaining = generatedSlots.filter((s) => !bookedTimes.has(s));
                return {
                    start: range.start,
                    end: range.end,
                    availableSlots: remaining.length,
                };
            });
            const totalAvailable = timeRangeResults.some((r) => r.availableSlots > 0);
            return {
                date: dateStr,
                isAvailable: isAvailable && totalAvailable,
                timeRanges: timeRangeResults,
            };
        });
        return {
            lawyerId,
            month: (0, date_fns_1.format)(baseDate, "yyyy-MM"),
            availableDates,
            slotDuration,
            maxDaysInAdvance,
        };
    }
}
exports.FetchLawyerCalendarAvailabilityUseCase = FetchLawyerCalendarAvailabilityUseCase;
