"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletTransactionsQuerySchema = void 0;
const zod_1 = require("zod");
exports.FetchWalletTransactionsQuerySchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    type: zod_1.z
        .enum(["debit", "credit", "All"])
        .optional()
        .transform((val) => (val === "All" ? undefined : val)),
    startDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => !val || !isNaN(val.getTime()), {
        message: "Invalid startDate",
    }),
    endDate: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => !val || !isNaN(val.getTime()), {
        message: "Invalid endDate",
    }),
});
