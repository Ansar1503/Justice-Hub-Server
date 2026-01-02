"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllPracticeAreasQuery = void 0;
const zod_1 = require("zod");
exports.FindAllPracticeAreasQuery = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    specId: zod_1.z.string().default(""),
});
