import mongoose, { Document, Schema } from "mongoose";
import { IPlanBenefits } from "./SubscriptionModel";
type SubscriptionStatus = "active" | "expired" | "canceled" | "trialing";

export interface IUserSubscriptionModel extends Document {
  _id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  benefitsSnapshot: IPlanBenefits;
  createdAt: Date;
  updatedAt: Date;
}

const BenefitsSnapshotSchema = new Schema<IPlanBenefits>(
  {
    bookingsPerMonth: { type: Schema.Types.Mixed },
    followupBookingsPerCase: { type: Schema.Types.Mixed },
    chatAccess: { type: Boolean },
    discountPercent: { type: Number },
    documentUploadLimit: { type: Number },
    expiryAlert: { type: Boolean },
    autoRenew: { type: Boolean },
  },
  { _id: false }
);

const UserSubscriptionSchema = new Schema<IUserSubscriptionModel>(
  {
    _id: { type: String },
    userId: { type: String, required: true },
    planId: { type: String, required: true },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
    status: {
      type: String,
      enum: ["active", "expired", "canceled", "trialing"],
      required: true,
      default: "active",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    autoRenew: { type: Boolean, default: true },
    benefitsSnapshot: { type: BenefitsSnapshotSchema, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true }
);

export const UserSubscriptionModel = mongoose.model<IUserSubscriptionModel>(
  "userSubscription",
  UserSubscriptionSchema
);
