"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPaymentsQueryValidation = void 0;
const zod_1 = require("zod");
exports.fetchPaymentsQueryValidation = zod_1.z.object({
    page: zod_1.z
        .string()
        .transform(Number)
        .refine((v) => !isNaN(v) && v > 0, {
        message: "page must be a positive number",
    }),
    limit: zod_1.z
        .string()
        .transform(Number)
        .refine((v) => !isNaN(v) && v > 0, {
        message: "limit must be a positive number",
    }),
    sortBy: zod_1.z.enum(["date", "amount"]),
    order: zod_1.z.enum(["asc", "desc"]),
    status: zod_1.z.enum(["pending", "paid", "failed", "refunded", "all"]),
    paidFor: zod_1.z.enum(["subscription", "appointment", "all"]),
});
