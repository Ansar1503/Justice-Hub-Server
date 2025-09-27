import { z } from "zod";

export const FetchWalletTransactionsQuerySchema = z.object({
    search: z.string().default(""),
    page: z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    type: z
        .enum(["debit", "credit", "All"])
        .optional()
        .transform((val) => (val === "All" ? undefined : val)),
    startDate: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => !val || !isNaN(val.getTime()), {
            message: "Invalid startDate",
        }),
    endDate: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((val) => !val || !isNaN(val.getTime()), {
            message: "Invalid endDate",
        }),
});
