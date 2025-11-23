import { z } from "zod";

export const UpdateCasesDetailsFormSchema = z.object({
    title: z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((v) => v === "" || v.length >= 5, {
            message: "Title must be at least 5 characters or empty",
        }),

    summary: z
        .string()
        .optional()
        .transform((val) => val?.trim() || "")
        .refine((v) => v === "" || v.length <= 200, {
            message: "Summary cannot exceed 200 characters",
        }),

    estimatedValue: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val))
        .refine(
            (v) => v === 0 || v >= 500,
            { message: "Estimated value must be 0 or at least ₹500" }
        ),

    nextHearing: z
        .string()
        .optional()
        .transform((val) => (val ? new Date(val) : undefined))
        .refine((v) => !v || !isNaN(v.getTime()), {
            message: "Invalid date format",
        }),
    status: z.enum(["open", "closed", "onhold"], {
        required_error: "Status is required",
        invalid_type_error: "Invalid status",
    }),
});
