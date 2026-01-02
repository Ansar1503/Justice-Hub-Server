"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOverrideSlotsUseCase = void 0;
const http_1 = require("http");
const DateAndTimeHelper_1 = require("@shared/utils/helpers/DateAndTimeHelper");
const Override_1 = require("@domain/entities/Override");
class AddOverrideSlotsUseCase {
    slotSettingsRepo;
    overrideSlotRepo;
    constructor(slotSettingsRepo, overrideSlotRepo) {
        this.slotSettingsRepo = slotSettingsRepo;
        this.overrideSlotRepo = overrideSlotRepo;
    }
    async execute(input) {
        input.overrideDates.forEach((oveerride) => {
            oveerride.date = new Date(oveerride.date.getTime() - oveerride.date.getTimezoneOffset() * 60000);
        });
        const slotSettings = await this.slotSettingsRepo.fetchScheduleSettings(input.lawyer_id);
        if (!slotSettings) {
            const error = new Error("Settings not found, please create settings.");
            error.code = http_1.STATUS_CODES.NOT_FOUND;
            throw error;
        }
        const map = new Map();
        for (const override of input.overrideDates) {
            if (map.has(override.date)) {
                const error = new Error(`Duplicate override date found: ${override.date}`);
                error.code = http_1.STATUS_CODES.BAD_REQUEST;
                throw error;
            }
            else {
                map.set(override.date);
            }
        }
        map.clear();
        const timeRanges = input.overrideDates[0].timeRanges;
        if (timeRanges && timeRanges.length > 0) {
            const slots = timeRanges.map((time) => ({
                ...time,
                startMin: (0, DateAndTimeHelper_1.timeStringToMinutes)(time.start),
                endMin: (0, DateAndTimeHelper_1.timeStringToMinutes)(time.end),
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
                if (Math.abs(slot.startMin - slot.endMin) < slotSettings.slotDuration) {
                    const error = new Error(`Slot duration should be at least ${slotSettings.slotDuration} minutes.`);
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
            }
            const sorted = slots.sort((a, b) => a.startMin - b.startMin);
            for (let i = 0; i < sorted.length - 1; i++) {
                const current = sorted[i];
                const next = sorted[i + 1];
                if (current.endMin > next.startMin) {
                    const error = new Error(`Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end}`);
                    error.code = http_1.STATUS_CODES.BAD_REQUEST;
                    throw error;
                }
            }
        }
        const overridePayload = Override_1.Override.create(input);
        const updatedOverrideSlots = await this.overrideSlotRepo.addOverrideSlots(overridePayload);
        if (!updatedOverrideSlots)
            throw new Error("update failed");
        return {
            lawyer_id: updatedOverrideSlots.lawyerId,
            overrideDates: updatedOverrideSlots.overrideDates,
        };
    }
}
exports.AddOverrideSlotsUseCase = AddOverrideSlotsUseCase;
