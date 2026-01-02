"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCasesDocumentsByCaseInputZodSchema = void 0;
const zod_1 = require("zod");
exports.FetchCasesDocumentsByCaseInputZodSchema = zod_1.z.object({
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
    sort: zod_1.z.enum(["date", "size", "name"]).default("date"),
    uploadedBy: zod_1.z.enum(["lawyer", "client"]),
});
