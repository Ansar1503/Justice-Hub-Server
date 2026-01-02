"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommissionSettingsInputSchema = void 0;
const zod_1 = require("zod");
exports.CreateCommissionSettingsInputSchema = zod_1.z
    .object({
    id: zod_1.z.string().optional(),
    initialCommission: zod_1.z
        .number()
        .min(0, "Initial commission must be at least 0%")
        .max(40, "Initial commission cannot exceed 40%"),
    followupCommission: zod_1.z
        .number()
        .min(0, "Follow-up commission must be at least 0%")
        .max(40, "Follow-up commission cannot exceed 40%"),
})
    .refine((data) => data.followupCommission <= data.initialCommission - 5, {
    message: "Follow-up commission must be at least 5% less than initial commission",
    path: ["followupCommission"],
});
