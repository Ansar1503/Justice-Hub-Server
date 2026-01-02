"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubscriptionPlanZodInputSchema = exports.PlanBenefitsSchema = exports.IntervalTypeEnum = void 0;
const zod_1 = require("zod");
exports.IntervalTypeEnum = zod_1.z.enum(["none", "monthly", "yearly"]);
exports.PlanBenefitsSchema = zod_1.z.object({
    bookingsPerMonth: zod_1.z.union([
        zod_1.z.number().int().nonnegative(),
        zod_1.z.literal("unlimited"),
    ]),
    followupBookingsPerCase: zod_1.z.union([
        zod_1.z.number().int().nonnegative(),
        zod_1.z.literal("unlimited"),
    ]),
    chatAccess: zod_1.z.boolean(),
    discountPercent: zod_1.z.number().min(0).max(100),
    documentUploadLimit: zod_1.z.number().int().nonnegative(),
    expiryAlert: zod_1.z.boolean(),
    autoRenew: zod_1.z.boolean(),
});
exports.AddSubscriptionPlanZodInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Plan name is required"),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().nonnegative(),
    interval: exports.IntervalTypeEnum,
    stripeProductId: zod_1.z.string().optional(),
    stripePriceId: zod_1.z.string().optional(),
    isFree: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
    benefits: exports.PlanBenefitsSchema,
});
