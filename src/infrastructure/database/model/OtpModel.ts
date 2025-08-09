import mongoose, { Schema, Document } from "mongoose";

export interface IotpModel extends Document {
  _id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IotpModel>(
  {
    _id: { type: String },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const otpModel = mongoose.model<IotpModel>("otp", otpSchema);
export default otpModel;
