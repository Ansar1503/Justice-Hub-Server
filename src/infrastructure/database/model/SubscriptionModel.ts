import mongoose, { Document, Schema } from "mongoose";

type IntervalType = "none" | "monthly" | "yearly";

export interface IPlanBenefits {
  bookingsPerMonth: number | "unlimited";
  followupBookingsPerCase: number | "unlimited";
  chatAccess: boolean;
  discountPercent: number;
  documentUploadLimit: number;
  expiryAlert: boolean;
  autoRenew: boolean;
}

export interface ISubscriptionPlanModel extends Document {
  _id: string;
  name: string;
  description?: string;
  price: number;
  interval: IntervalType;
  stripeProductId?: string;
  stripePriceId?: string;
  isFree: boolean;
  isActive: boolean;
  benefits: IPlanBenefits;
  createdAt: Date;
  updatedAt: Date;
}

const PlanBenefitsSchema = new Schema<IPlanBenefits>(
  {
    bookingsPerMonth: { type: Schema.Types.Mixed, required: true },
    followupBookingsPerCase: { type: Schema.Types.Mixed, required: true },
    chatAccess: { type: Boolean, default: false },
    discountPercent: { type: Number, default: 0 },
    documentUploadLimit: { type: Number, default: 3 },
    expiryAlert: { type: Boolean, default: true },
    autoRenew: { type: Boolean, default: false },
  },
  { _id: false }
);

const SubscriptionPlanSchema = new Schema<ISubscriptionPlanModel>(
  {
    _id: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    interval: {
      type: String,
      enum: ["none", "monthly", "yearly"],
      required: true,
    },
    stripeProductId: { type: String },
    stripePriceId: { type: String },
    isFree: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    benefits: { type: PlanBenefitsSchema, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const SubscriptionPlanModel = mongoose.model<ISubscriptionPlanModel>(
  "subscriptionPlan",
  SubscriptionPlanSchema
);
