"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFollowupAppointmentByWalletZodSchema = exports.BookAppointmentsByWalletZodSchema = void 0;
const zod_1 = require("zod");
exports.BookAppointmentsByWalletZodSchema = zod_1.z.object({
    lawyer_id: zod_1.z.string().min(1, "Lawyer ID is required"),
    date: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
    }, zod_1.z.date({ required_error: "Date is required" })),
    timeSlot: zod_1.z.string().min(1, "Time slot is required"),
    duration: zod_1.z.number().min(1, "Duration must be greater than 0"),
    reason: zod_1.z.string().min(1, "Reason is required"),
    caseTypeId: zod_1.z.string().min(1, "Case ID is required"),
    title: zod_1.z.string().min(1, "Title is required"),
});
exports.BookFollowupAppointmentByWalletZodSchema = zod_1.z.object({
    lawyer_id: zod_1.z.string().min(1, "Lawyer ID is required"),
    caseId: zod_1.z.string().min(1, "Case ID is required"),
    date: zod_1.z.preprocess((val) => {
        if (typeof val === "string" || val instanceof Date)
            return new Date(val);
    }, zod_1.z.date({ required_error: "Date is required" })),
    timeSlot: zod_1.z.string().min(1, "Time slot is required"),
    duration: zod_1.z.number().min(1, "Duration must be greater than 0"),
    reason: zod_1.z.string().min(1, "Reason is required"),
});
