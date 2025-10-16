import { z } from "zod";

export const IntervalTypeEnum = z.enum(["none", "monthly", "yearly"]);

export const PlanBenefitsSchema = z.object({
  bookingsPerMonth: z.union([
    z.number().int().nonnegative(),
    z.literal("unlimited"),
  ]),
  followupBookingsPerCase: z.union([
    z.number().int().nonnegative(),
    z.literal("unlimited"),
  ]),
  chatAccess: z.boolean(),
  discountPercent: z.number().min(0).max(100),
  documentUploadLimit: z.number().int().nonnegative(),
  expiryAlert: z.boolean(),
  autoRenew: z.boolean(),
});

export const AddSubscriptionPlanZodInputSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  interval: IntervalTypeEnum,
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  isFree: z.boolean().default(false),
  isActive: z.boolean().default(true),
  benefits: PlanBenefitsSchema,
});

export type AddSubscriptionPlanInput = z.infer<
  typeof AddSubscriptionPlanZodInputSchema
>;
