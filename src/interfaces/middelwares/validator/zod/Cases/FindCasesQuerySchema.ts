import { z } from "zod";

export const FindCasesQueryInputZodSchema = z.object({
    search: z.string().default(""),
    page: z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    sortBy: z.enum(["date", "title", "client", "lawyer"]).default("date"),
    status: z
        .enum(["open", "closed", "onhold", "All"])
        .optional()
        .transform((val) => (val === "All" ? undefined : val)),
    caseTypeFilter: z.string().optional(),
});
