"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSpecializationsQueryValidatorSchema = void 0;
const zod_1 = require("zod");
exports.FetchAllSpecializationsQueryValidatorSchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
});
