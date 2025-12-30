import mongoose, { Document, Schema } from "mongoose";

export type PaymentPurpose = "subscription" | "appointment";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface IPaymentModel extends Document {
  _id: string;
  clientId: string;
  paidFor: PaymentPurpose;
  referenceId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerRefId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPaymentModel>(
  {
    _id: { type: String },
    clientId: { type: String, required: true },
    paidFor: {
      type: String,
      required: true,
      enum: ["subscription", "appointment"],
    },
    referenceId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["pending", "paid", "failed", "refunded"],
    },
    provider: {
      type: String,
      required: true,
      enum: ["stripe"],
    },
    providerRefId: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const PaymentModel = mongoose.model<IPaymentModel>(
  "payment",
  PaymentSchema
);
