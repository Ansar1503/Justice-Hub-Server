import { z } from "zod";

const TimeSlotSchema = z.object({
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
});

const DayAvailabilitySchema = z.object({
    enabled: z.boolean(),
    timeSlots: z.array(TimeSlotSchema).default([{ start: "9:00", end: "17:00" }]),
});

export const UpdateAvailableSlotsBodyValidateSchema = z.object({
    monday: DayAvailabilitySchema,
    tuesday: DayAvailabilitySchema,
    wednesday: DayAvailabilitySchema,
    thursday: DayAvailabilitySchema,
    friday: DayAvailabilitySchema,
    saturday: DayAvailabilitySchema,
    sunday: DayAvailabilitySchema,
});
