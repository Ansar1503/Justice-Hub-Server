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

export interface CreateFollowupCheckoutSessionInputDto {
  client_id: string;
  date: Date;
  timeSlot: string;
  reason: string;
  lawyer_id: string;
  duration: number;
  caseId: string;
}
