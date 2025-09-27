import { z } from "zod";

export const BookAppointmentsByWalletZodSchema = z.object({
    lawyer_id: z.string().min(1, "Lawyer ID is required"),
    date: z.preprocess(
        (val) => {
            if (typeof val === "string" || val instanceof Date) return new Date(val);
        },
        z.date({ required_error: "Date is required" }),
    ),
    timeSlot: z.string().min(1, "Time slot is required"),
    duration: z.number().min(1, "Duration must be greater than 0"),
    reason: z.string().min(1, "Reason is required"),
    caseTypeId: z.string().min(1, "Case ID is required"),
    title: z.string().min(1, "Title is required"),
});
