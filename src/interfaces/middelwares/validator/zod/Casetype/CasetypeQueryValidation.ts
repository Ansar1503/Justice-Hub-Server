import { z } from "zod";

export const CasetypeQueryValidationSchema = z.object({
    search: z.string().default(""),
    page: z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    pid: z.string().default(""),
});
