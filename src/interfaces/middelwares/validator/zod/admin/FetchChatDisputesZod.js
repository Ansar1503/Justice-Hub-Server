"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchChatDisputesQueryZodValidator = void 0;
const zod_1 = require("zod");
exports.FetchChatDisputesQueryZodValidator = zod_1.z.object({
    search: zod_1.z.string().default(""),
    page: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("1"),
    limit: zod_1.z
        .string()
        .transform((val) => parseInt(val))
        .default("10"),
    sortBy: zod_1.z.enum(["message_date", "reported_date"]).default("message_date"),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
});
