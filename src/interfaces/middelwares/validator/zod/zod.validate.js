"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodReviewDisputesQuerySchema = exports.zodChatDisputesQuerySchema = exports.zodSessionQuerySchema = exports.zodAppointmentQuerySchema = exports.zodOverrideSlotsSchema = void 0;
const zod_1 = require("zod");
exports.zodOverrideSlotsSchema = zod_1.z.array(zod_1.z.object({
    date: zod_1.z.coerce.date(),
    isUnavailable: zod_1.z.boolean(),
    timeRanges: zod_1.z
        .array(zod_1.z.object({
        start: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
        end: zod_1.z.string().regex(/^\d{2}:\d{2}$/),
    }))
        .default([{ start: "9:00", end: "17:00" }]),
}));
exports.zodAppointmentQuerySchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortBy: zod_1.z.enum(["fee", "client_name", "lawyer_name", "date"]).default("date"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
    appointmentStatus: zod_1.z.enum(["pending", "confirmed", "completed", "cancelled", "rejected", "all"]),
    consultationType: zod_1.z.enum(["consultation", "follow-up", "all"]),
});
exports.zodSessionQuerySchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortBy: zod_1.z.enum(["date", "amount", "client_name", "lawyer_name"]).default("date"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
    status: zod_1.z.enum(["upcoming", "ongoing", "completed", "cancelled", "missed", "all"]),
    consultation_type: zod_1.z.enum(["consultation", "follow-up", "all"]),
});
exports.zodChatDisputesQuerySchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
    sortBy: zod_1.z.enum(["All", "session_date", "reported_date"]).default("reported_date"),
});
exports.zodReviewDisputesQuerySchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
    sortBy: zod_1.z.enum(["All", "review_date", "reported_date"]).default("review_date"),
});
