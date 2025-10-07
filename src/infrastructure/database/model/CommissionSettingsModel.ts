import mongoose, { Document, Schema } from "mongoose";

export interface ICommissionSettingsModel extends Document {
  _id: string;
  initialCommission: number;
  followupCommission: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSettingsSchema = new Schema<ICommissionSettingsModel>(
  {
    _id: { type: String },
    initialCommission: { type: Number, required: true },
    followupCommission: { type: Number, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const CommissionSettingsModel = mongoose.model(
  "commissionSettings",
  CommissionSettingsSchema
);
