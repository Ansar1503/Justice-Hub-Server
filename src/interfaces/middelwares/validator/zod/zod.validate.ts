import { z } from "zod";

export const zodOverrideSlotsSchema = z.array(
  z.object({
    date: z.coerce.date(),
    isUnavailable: z.boolean(),
    timeRanges: z
      .array(
        z.object({
          start: z.string().regex(/^\d{2}:\d{2}$/),
          end: z.string().regex(/^\d{2}:\d{2}$/),
        })
      )
      .optional(),
  })
);

export const zodAppointmentQuerySchema = z.object({
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .default("10"),
  sortBy: z
    .enum(["date", "amount", "client_name", "lawyer_name"])
    .default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  status: z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
    "rejected",
    "all",
  ]),
  type: z.enum(["consultation", "follow-up", "all"]),
});
