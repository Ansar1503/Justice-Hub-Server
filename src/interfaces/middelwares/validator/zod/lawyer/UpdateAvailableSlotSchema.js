"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailableSlotsBodyValidateSchema = void 0;
const zod_1 = require("zod");
const TimeSlotSchema = zod_1.z.object({
    start: zod_1.z.string().min(1, "Start time is required"),
    end: zod_1.z.string().min(1, "End time is required"),
});
const DayAvailabilitySchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    timeSlots: zod_1.z.array(TimeSlotSchema).default([{ start: "9:00", end: "17:00" }]),
});
exports.UpdateAvailableSlotsBodyValidateSchema = zod_1.z.object({
    monday: DayAvailabilitySchema,
    tuesday: DayAvailabilitySchema,
    wednesday: DayAvailabilitySchema,
    thursday: DayAvailabilitySchema,
    friday: DayAvailabilitySchema,
    saturday: DayAvailabilitySchema,
    sunday: DayAvailabilitySchema,
});
