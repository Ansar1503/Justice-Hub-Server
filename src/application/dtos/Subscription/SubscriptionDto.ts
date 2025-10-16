type IntervalType = "none" | "monthly" | "yearly";

export interface PlanBenefits {
  bookingsPerMonth: number | "unlimited";
  followupBookingsPerCase: number | "unlimited";
  chatAccess: boolean;
  discountPercent: number;
  documentUploadLimit: number;
  expiryAlert: boolean;
  autoRenew: boolean;
}

export interface SubscriptionBaseDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: IntervalType;
  stripeProductId?: string;
  stripePriceId?: string;
  isFree: boolean;
  isActive: boolean;
  benefits: PlanBenefits;
  createdAt: Date;
  updatedAt: Date;
}
