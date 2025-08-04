import mongoose, { Schema, Document, Types } from "mongoose";

type VerificationStatus = "verified" | "rejected" | "pending" | "requested";
export interface ILawyerModel extends Document {
  _id: string;
  user_id: string;
  description: string;
  barcouncil_number: string;
  enrollment_certificate_number: string;
  certificate_of_practice_number: string;
  verification_status: VerificationStatus;
  practice_areas: string[];
  experience: number;
  specialisation: string[];
  consultation_fee: number;
  documents: Types.ObjectId;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerSchema = new Schema<ILawyerModel>(
  {
    _id: { type: String },
    user_id: { type: String, required: true, unique: true },
    description: { type: String, required: false, default: "" },
    documents: {
      ref: "LawyerDocuments",
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    barcouncil_number: { type: String, required: false },
    enrollment_certificate_number: { type: String, required: false },
    certificate_of_practice_number: { type: String, required: false },
    practice_areas: { type: [String], required: false },
    verification_status: {
      type: String,
      enum: ["verified", "rejected", "pending", "requested"],
      required: true,
      default: "pending",
    },
    rejectReason: { type: String, requred: false },
    experience: { type: Number, required: false },
    specialisation: { type: [String], required: false },
    consultation_fee: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerModel>("Lawyer", LawyerSchema);
