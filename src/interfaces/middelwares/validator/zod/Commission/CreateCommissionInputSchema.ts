import { z } from "zod";

export const CreateCommissionSettingsInputSchema = z
  .object({
    id: z.string().optional(),
    initialCommission: z
      .number()
      .min(0, "Initial commission must be at least 0%")
      .max(40, "Initial commission cannot exceed 40%"),
    followupCommission: z
      .number()
      .min(0, "Follow-up commission must be at least 0%")
      .max(40, "Follow-up commission cannot exceed 40%"),
  })
  .refine((data) => data.followupCommission <= data.initialCommission - 5, {
    message:
      "Follow-up commission must be at least 5% less than initial commission",
    path: ["followupCommission"],
  });
