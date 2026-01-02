"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailableSlotUseCase = void 0;
const http_1 = require("http");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const Availability_1 = require("@domain/entities/Availability");
class UpdateAvailableSlotUseCase {
    scheduleSettings;
    availableSlotRepo;
    constructor(scheduleSettings, availableSlotRepo) {
        this.scheduleSettings = scheduleSettings;
        this.availableSlotRepo = availableSlotRepo;
    }
    async execute(input) {
        const settings = await this.scheduleSettings.fetchScheduleSettings(input.lawyer_id);
        if (!settings) {
            const error = new Error("Settings not found, please create settings.");
            error.code = http_1.STATUS_CODES.NOT_FOUND;
            throw error;
        }
        for (const [day, data] of Object.entries(input)) {
            if (!data?.enabled)
                continue;
            const slots = data.timeSlots.map((slot) => ({
                ...slot,
                startMin: (0, DateAndTimeHelper_1.timeStringToMinutes)(slot.start),
                endMin: (0, DateAndTimeHelper_1.timeStringToMinutes)(slot.end),
            }));
            for (const slot of slots) {
                if (slot.startMin < 0 || slot.endMin > 1440) {
                    const error = new Error("Time should be between 00:00 and 23:59.");
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
                if (slot.startMin >= slot.endMin) {
                    const error = new Error("Start time should be less than end time.");
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
                if (Math.abs(slot.startMin - slot.endMin) < settings.slotDuration) {
                    const error = new Error(`Slot duration should be at least ${settings.slotDuration} minutes.`);
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
            }
            const sorted = slots.sort((a, b) => a.startMin - b.startMin);
            for (let i = 0; i < sorted.length - 1; i++) {
                const current = sorted[i];
                const next = sorted[i + 1];
                if (current.endMin > next.startMin) {
                    const error = new Error(`Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end} on ${day}`);
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
            }
        }
        const availibilitypayload = Availability_1.Availability.create({
            lawyer_id: input.lawyer_id,
            monday: input.monday,
            tuesday: input.tuesday,
            wednesday: input.wednesday,
            thursday: input.thursday,
            friday: input.friday,
            saturday: input.saturday,
            sunday: input.sunday,
        });
        const updatedAvailability = await this.availableSlotRepo.updateAvailbleSlot(availibilitypayload);
        if (!updatedAvailability)
            throw new Error("availble slot updation failed");
        return {
            id: updatedAvailability.id,
            lawyer_id: updatedAvailability.lawyer_id,
            monday: updatedAvailability.getDayAvailability("monday"),
            tuesday: updatedAvailability.getDayAvailability("tuesday"),
            wednesday: updatedAvailability.getDayAvailability("wednesday"),
            thursday: updatedAvailability.getDayAvailability("thursday"),
            friday: updatedAvailability.getDayAvailability("friday"),
            saturday: updatedAvailability.getDayAvailability("saturday"),
            sunday: updatedAvailability.getDayAvailability("sunday"),
            createdAt: updatedAvailability.createdAt,
            updatedAt: updatedAvailability.updatedAt,
        };
    }
}
exports.UpdateAvailableSlotUseCase = UpdateAvailableSlotUseCase;
