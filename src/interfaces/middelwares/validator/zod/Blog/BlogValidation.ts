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
  isPublished: z.boolean().optional(),
});
