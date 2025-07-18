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

export const zodSessionQuerySchema = z.object({
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
    "upcoming",
    "ongoing",
    "completed",
    "cancelled",
    "missed",
    "all",
  ]),
  type: z.enum(["consultation", "follow-up", "all"]),
});

export const zodChatDisputesQuerySchema = z.object({
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .default("10"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  sortBy: z
    .enum(["All", "session_date", "reported_date"])
    .default("reported_date"),
});

export const zodReviewDisputesQuerySchema = z.object({
  search: z.string().default(""),
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .default("10"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  sortBy: z
    .enum(["All", "review_date", "reported_date"])
    .default("review_date"),
});
