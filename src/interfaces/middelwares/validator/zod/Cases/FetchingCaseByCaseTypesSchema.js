"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseByCaseTypesSchema = void 0;
const zod_1 = require("zod");
exports.FetchCaseByCaseTypesSchema = zod_1.z
    .object({
    caseTypeIds: zod_1.z.union([zod_1.z.array(zod_1.z.string()), zod_1.z.string()]),
})
    .transform((data) => {
    const idsArray = Array.isArray(data.caseTypeIds)
        ? data.caseTypeIds
        : [data.caseTypeIds];
    return {
        caseTypeIds: idsArray,
    };
});
