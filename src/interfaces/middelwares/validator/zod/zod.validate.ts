import {z} from 'zod';

export const zodOverrideSlotsSchema = z.array(z.object({
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
}))
