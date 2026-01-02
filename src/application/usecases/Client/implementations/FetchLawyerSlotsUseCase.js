"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerSlotsUseCase = void 0;
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const errors_1 = require("@infrastructure/constant/errors");
class FetchLawyerSlotsUseCase {
    userRepository;
    lawyerRepository;
    scheduleSettingsRepo;
    appointmentRepo;
    ovverrideRepo;
    availableSlotsRepo;
    constructor(userRepository, lawyerRepository, scheduleSettingsRepo, appointmentRepo, ovverrideRepo, availableSlotsRepo) {
        this.userRepository = userRepository;
        this.lawyerRepository = lawyerRepository;
        this.scheduleSettingsRepo = scheduleSettingsRepo;
        this.appointmentRepo = appointmentRepo;
        this.ovverrideRepo = ovverrideRepo;
        this.availableSlotsRepo = availableSlotsRepo;
    }
    async execute(input) {
        const { client_id, date, lawyer_id } = input;
        const filterBookedSlots = (slots) => slots.filter((t) => !booked.has(t));
        const user = await this.userRepository.findByuser_id(lawyer_id);
        if (!user)
            throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
        if (user.is_blocked)
            throw new Error(errors_1.ERRORS.USER_BLOCKED);
        const lawyer = await this.lawyerRepository.findByUserId(lawyer_id);
        if (!lawyer)
            throw new Error(errors_1.ERRORS.USER_NOT_FOUND);
        if (lawyer.verificationStatus !== "verified")
            throw new Error(errors_1.ERRORS.LAWYER_NOT_VERIFIED);
        const slotSettings = await this.scheduleSettingsRepo.fetchScheduleSettings(lawyer_id);
        if (!slotSettings) {
            const error = new Error("slot settings not found for the lawyer");
            error.code = 404;
            throw error;
        }
        const existingAppointment = await this.appointmentRepo.findByDateandLawyer_id({
            date,
            lawyer_id,
        });
        const booked = new Set();
        existingAppointment?.forEach((a) => (a.payment_status !== "failed" && a.status != "cancelled") && booked.add(a.time));
        const slotDuration = slotSettings.slotDuration;
        const override = await this.ovverrideRepo.fetcghOverrideSlotByDate(lawyer_id, date);
        const availableSlots = await this.availableSlotsRepo.findAvailableSlots(lawyer_id);
        if (!availableSlots) {
            const error = new Error("No available slots found for the lawyer");
            error.code = 404;
            throw error;
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
        if (override && override.overrideDates.length > 0) {
            const overrideSlot = override.overrideDates[0];
            if (overrideSlot.isUnavailable) {
                return {
                    slots: [],
                    isAvailable: false,
                };
            }
            if (overrideSlot.timeRanges && overrideSlot.timeRanges.length > 0) {
                let allSlots = [];
                for (let i = 0; i < overrideSlot.timeRanges.length; i++) {
                    const timeRange = overrideSlot.timeRanges[i];
                    const timeSlot = (0, DateAndTimeHelper_1.generateTimeSlots)(timeRange.start, timeRange.end, slotDuration);
                    allSlots.push(...timeSlot);
                }
                allSlots = filterBookedSlots(allSlots);
                if (isToday(date)) {
                    allSlots = allSlots.filter(isSlotInFuture);
                }
                return {
                    slots: allSlots,
                    isAvailable: allSlots.length > 0,
                };
            }
        }
        // console.log("day", day);
        // console.log("availbalie", availableSlots[day]);
        if (!availableSlots.getDayAvailability(day).enabled) {
            return {
                slots: [],
                isAvailable: false,
            };
        }
        let daySlots = [];
        for (const range of availableSlots.getDayAvailability(day).timeSlots) {
            daySlots.push(...(0, DateAndTimeHelper_1.generateTimeSlots)(range.start, range.end, slotDuration));
        }
        daySlots = filterBookedSlots(daySlots);
        if (isToday(date)) {
            daySlots = daySlots.filter(isSlotInFuture);
        }
        return {
            slots: daySlots,
            isAvailable: daySlots.length > 0,
        };
    }
}
exports.FetchLawyerSlotsUseCase = FetchLawyerSlotsUseCase;
const isToday = (someDate) => {
    const today = new Date();
    return (someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear());
};
const isSlotInFuture = (slotTime) => {
    const now = new Date();
    const [hours, minutes] = slotTime.split(":").map(Number);
    const slotDate = new Date();
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate > now;
};
