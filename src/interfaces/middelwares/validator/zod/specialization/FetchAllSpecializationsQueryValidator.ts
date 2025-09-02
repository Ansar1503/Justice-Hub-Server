import { z } from "zod";

export const FetchAllSpecializationsQueryValidatorSchema = z.object({
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .default("10"),
});
