import { z } from "zod";

export const PracticeAreaSchema = z.object({
    id: z.string().min(1, "PracticeArea id is required"),
    name: z.string().min(1, "PracticeArea name is required"),
});

export const SpecializationSchema = z.object({
    id: z.string().min(1, "Specialization id is required"),
    name: z.string().min(1, "Specialization name is required"),
});

export const ProfessionalDetailsSchema = z.object({
    description: z.string().min(1, "Description is required"),
    practiceAreas: z
        .array(PracticeAreaSchema)
        .min(1, "At least one practice area is required"),
    specialisations: z
        .array(SpecializationSchema)
        .min(1, "At least one specialization is required"),
    experience: z.number().int().min(1, "Minimum 1 year experience required"),
    consultationFee: z
        .number()
        .int()
        .min(100, "Consultation fee should be at least ₹100"),
});

export type ProfessionalDetailsFormData = z.infer<
  typeof ProfessionalDetailsSchema
>;
