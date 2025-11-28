
export interface SalesReportRow {
    date: string;
    lawyerName: string;
    lawyerId: string;
    clientId: string;
    bookingId: string;
    type: "initial" | "followup";
    baseFee: number;
    subscriptionDiscount: number;
    followupDiscount: number;
    amountPaid: number;
    commissionPercent: number;
    commissionAmount: number;
    lawyerAmount: number;
    status: string;
}

