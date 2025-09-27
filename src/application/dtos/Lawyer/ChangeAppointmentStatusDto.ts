type PaymentStatus = "pending" | "success" | "failed";
type AppointmentType = "consultation" | "follow-up";
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "rejected";

export interface ChangeAppointmentStatusInputDto {
    id: string;
    status: "confirmed" | "pending" | "completed" | "cancelled" | "rejected";
}

export interface ChangeAppointmentStatusOutputDto {
    id: string;
    lawyer_id: string;
    client_id: string;
    caseId: string;
    bookingId: string;
    date: Date;
    time: string;
    duration: number;
    reason: string;
    amount: number;
    payment_status: PaymentStatus;
    type: AppointmentType;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date;
}
