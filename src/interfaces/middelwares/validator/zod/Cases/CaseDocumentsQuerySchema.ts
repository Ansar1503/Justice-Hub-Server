import { z } from "zod";

export const FetchCasesDocumentsByCaseInputZodSchema = z.object({
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
  sort: z.enum(["date", "size", "name"]).default("date"),
  uploadedBy: z.enum(["lawyer", "client"]),
});
