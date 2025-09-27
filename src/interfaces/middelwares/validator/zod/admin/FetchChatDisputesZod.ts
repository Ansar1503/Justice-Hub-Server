import { z } from "zod";

export const FetchChatDisputesQueryZodValidator = z.object({
    search: z.string().default(""),
    page: z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortBy: z.enum(["message_date", "reported_date"]).default("message_date"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
