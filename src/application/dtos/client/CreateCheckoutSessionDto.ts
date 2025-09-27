export interface CreateCheckoutSessionInputDto {
    client_id: string;
    lawyer_id: string;
    date: Date;
    timeSlot: string;
    duration: number;
    reason: string;
    caseId: string;
    title: string;
}
