import mongoose, { Schema, Document } from "mongoose";

export type VerificationStatus =
  | "verified"
  | "rejected"
  | "pending"
  | "requested";

export interface ILawyerVerificationModel extends Document {
  _id: string;
  userId: string;
  barCouncilNumber: string;
  enrollmentCertificateNumber: string;
  certificateOfPracticeNumber: string;
  verificationStatus: VerificationStatus;
  rejectReason?: string;
  documents: string;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerVerificationSchema = new Schema<ILawyerVerificationModel>(
  {
    _id: { type: String },
    userId: { type: String, required: true, unique: true },
    barCouncilNumber: { type: String },
    enrollmentCertificateNumber: { type: String },
    certificateOfPracticeNumber: { type: String },
    verificationStatus: {
      type: String,
      enum: ["verified", "rejected", "pending", "requested"],
      default: "pending",
      required: true,
    },
    rejectReason: { type: String },
    documents: { type: String, ref: "LawyerDocuments" },
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerVerificationModel>(
  "LawyerVerification",
  LawyerVerificationSchema
);
