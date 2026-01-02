"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByLawyerQueryZodSchema = void 0;
const zod_1 = require("zod");
exports.FetchBlogsByLawyerQueryZodSchema = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((n) => !Number.isNaN(n) && n > 0, {
        message: "page must be a positive integer",
    })
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((n) => !Number.isNaN(n) && n > 0, {
        message: "limit must be a positive integer",
    })
        .default("10"),
    filter: zod_1.z.enum(["all", "published", "draft"]).default("all"),
    sort: zod_1.z
        .enum(["newest", "oldest", "title-asc", "title-desc", "likes", "comments"])
        .default("newest"),
});
