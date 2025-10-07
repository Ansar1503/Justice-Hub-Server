type BookingType = "initial" | "followup";
type TransactionStatus = "pending" | "credited" | "failed";

export interface CommissionTransactionsDto {
  id: string;
  bookingId: string;
  clientId: string;
  lawyerId: string;
  amountPaid: number;
  commissionPercent: number;
  commissionAmount: number;
  lawyerAmount: number;
  type: BookingType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
