import mongoose, { Schema, Document } from "mongoose";
import { Otp } from "../../../domain/entities/Otp.entity";

export interface IotpModel extends Document, Otp {}

const otpSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const otpModel = mongoose.model<IotpModel>("otp", otpSchema);
export default otpModel;