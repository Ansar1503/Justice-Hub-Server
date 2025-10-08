import mongoose, { Document, Schema } from "mongoose";

type BookingType = "initial" | "followup";
type TransactionStatus = "pending" | "credited" | "failed";

export interface ICommissionTransactionModel extends Document {
  _id: string;
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

const CommissionTransactionSchema = new Schema<ICommissionTransactionModel>(
  {
    _id: { type: String },
    bookingId: { type: String, required: true },
    clientId: { type: String, required: true },
    lawyerId: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    lawyerAmount: { type: Number, required: true },
    type: { type: String, required: true, enum: ["initial", "followup"] },
    status: {
      type: String,
      required: true,
      enum: ["pending", "credited", "failed"],
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CommissionTransactionModel = mongoose.model(
  "commissionTransaction",
  CommissionTransactionSchema
);
