export type PaymentPurpose = "subscription" | "appointment";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface PaymentBaseDto {
  id: string;
  clientId: string;
  paidFor: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerRefId: string;
  createdAt: Date;
}
