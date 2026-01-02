"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchBlogsByClientSchema = exports.CreateBlogSchema = void 0;
const zod_1 = require("zod");
exports.CreateBlogSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .trim()
        .min(3, "title must be at least 3 characters")
        .max(250, "title is too long"),
    content: zod_1.z.string().trim().min(10, "content must be at least 10 characters"),
    coverImage: zod_1.z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^(https?:\/\/|\/)/.test(v), "coverImage must be an absolute URL or a relative path (start with '/')"),
    isPublished: zod_1.z
        .union([zod_1.z.boolean(), zod_1.z.string()])
        .optional()
        .transform((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return Boolean(val);
    }),
});
exports.FetchBlogsByClientSchema = zod_1.z.object({
    cursor: zod_1.z.preprocess((val) => {
        if (val === undefined || val === null || val === "")
            return undefined;
        const n = Number(val);
        return Number.isFinite(n) ? Math.floor(n) : undefined;
    }, zod_1.z.number().int().min(1).optional()),
    search: zod_1.z.string().trim().default(""),
    sortBy: zod_1.z.enum(["newest", "most-liked", "most-commented"]).default("newest"),
});
