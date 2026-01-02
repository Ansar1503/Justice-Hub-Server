"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfessionalDetailsSchema = exports.SpecializationSchema = exports.PracticeAreaSchema = void 0;
const zod_1 = require("zod");
exports.PracticeAreaSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "PracticeArea id is required"),
    name: zod_1.z.string().min(1, "PracticeArea name is required"),
});
exports.SpecializationSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "Specialization id is required"),
    name: zod_1.z.string().min(1, "Specialization name is required"),
});
exports.ProfessionalDetailsSchema = zod_1.z.object({
    description: zod_1.z.string().min(1, "Description is required"),
    practiceAreas: zod_1.z.array(exports.PracticeAreaSchema).min(1, "At least one practice area is required"),
    specialisations: zod_1.z.array(exports.SpecializationSchema).min(1, "At least one specialization is required"),
    experience: zod_1.z.number().int().min(1, "Minimum 1 year experience required"),
    consultationFee: zod_1.z.number().int().min(100, "Consultation fee should be at least ₹100"),
});
