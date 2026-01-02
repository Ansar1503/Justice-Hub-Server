"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCasesQueryInputZodSchema = void 0;
const zod_1 = require("zod");
exports.FindCasesQueryInputZodSchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc"),
    sortBy: zod_1.z.enum(["date", "title", "client", "lawyer"]).default("date"),
    status: zod_1.z
        .enum(["open", "closed", "onhold", "All"])
        .optional()
        .transform((val) => (val === "All" ? undefined : val)),
    caseTypeFilter: zod_1.z.string().optional(),
});
