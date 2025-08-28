import mongoose, { Document, mongo, Schema } from "mongoose";

type transactionCategory =
  | "deposit"
  | "withdrawal"
  | "payment"
  | "refund"
  | "transfer";
type transactionStatus = "pending" | "completed" | "failed" | "cancelled";

export interface IWalletTransactionModel extends Document {
  _id: string;
  walletId: string;
  amount: number;
  type: "debit" | "credit";
  description: string;
  category: transactionCategory;
  status: transactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const walletTransactionSchema = new Schema<IWalletTransactionModel>(
  {
    _id: { type: String },
    walletId: { type: String, required: true, ref: "wallets" },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ["debit", "credit"] },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["deposit", "withdrawal", "payment", "refund", "transfer"],
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed", "cancelled"],
    },
  },
  { timestamps: true }
);

export const walletTransactionModel = mongoose.model<IWalletTransactionModel>(
  "walletTransaction",
  walletTransactionSchema
);
