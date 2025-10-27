import { z } from "zod";

export const FetchBlogsByLawyerQueryZodSchema = z.object({
  search: z.string().default(""),

  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((n) => !Number.isNaN(n) && n > 0, {
      message: "page must be a positive integer",
    })
    .default("1"),

  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((n) => !Number.isNaN(n) && n > 0, {
      message: "limit must be a positive integer",
    })
    .default("10"),

  filter: z.enum(["all", "published", "draft"]).default("all"),

  sort: z
    .enum(["newest", "oldest", "title-asc", "title-desc", "likes", "comments"])
    .default("newest"),
});
