import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "title must be at least 3 characters")
    .max(250, "title is too long"),
  content: z.string().trim().min(10, "content must be at least 10 characters"),
  coverImage: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^(https?:\/\/|\/)/.test(v),
      "coverImage must be an absolute URL or a relative path (start with '/')"
    ),
  isPublished: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return Boolean(val);
    }),
});

export const FetchBlogsByClientSchema = z.object({
  cursor: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? Math.floor(n) : undefined;
  }, z.number().int().min(1).optional()),
  search: z.string().trim().default(""),
  sortBy: z.enum(["newest", "most-liked", "most-commented"]).default("newest"),
});
