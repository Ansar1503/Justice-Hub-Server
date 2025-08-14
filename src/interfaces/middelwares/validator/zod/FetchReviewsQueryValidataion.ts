import { z } from "zod";

export const FetchReviewsQueryValidation = z.object({
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .default("10"),
  sortBy: z.enum(["date", "rating"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});
