"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasesDetailsFormSchema = void 0;
const zod_1 = require("zod");
exports.UpdateCasesDetailsFormSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((v) => v === "" || v.length >= 5, {
        message: "Title must be at least 5 characters or empty",
    }),
    summary: zod_1.z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((v) => v === "" || v.length <= 200, {
        message: "Summary cannot exceed 200 characters",
    }),
    estimatedValue: zod_1.z
        .union([zod_1.z.string(), zod_1.z.number()])
        .transform((val) => Number(val))
        .refine((v) => v === 0 || v >= 500, { message: "Estimated value must be 0 or at least ₹500" }),
    nextHearing: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((v) => !v || !isNaN(v.getTime()), {
        message: "Invalid date format",
    }),
    status: zod_1.z.enum(["open", "closed", "onhold"], {
        required_error: "Status is required",
        invalid_type_error: "Invalid status",
    }),
});
