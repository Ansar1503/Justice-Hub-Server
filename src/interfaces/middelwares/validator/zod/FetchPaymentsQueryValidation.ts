import { z } from "zod";

export const fetchPaymentsQueryValidation = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((v) => !isNaN(v) && v > 0, {
      message: "page must be a positive number",
    }),
  limit: z
    .string()
    .transform(Number)
    .refine((v) => !isNaN(v) && v > 0, {
      message: "limit must be a positive number",
    }),
  sortBy: z.enum(["date", "amount"]),
  order: z.enum(["asc", "desc"]),
  status: z.enum(["pending", "paid", "failed", "refunded", "all"]),
  paidFor: z.enum(["subscription", "appointment", "all"]),
});
