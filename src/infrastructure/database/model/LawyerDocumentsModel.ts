import mongoose, { Schema, Document } from "mongoose";

export interface ILawyerDocumentsModel extends Document {
  _id: string;
  userId: string;
  enrollmentCertificate: string;
  certificateOfPractice: string;
  barCouncilCertificate: string;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerDocumentsSchema = new Schema<ILawyerDocumentsModel>(
  {
    _id: { type: String },
    userId: { type: String, required: true, unique: true },
    enrollmentCertificate: { type: String },
    certificateOfPractice: { type: String },
    barCouncilCertificate: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerDocumentsModel>(
  "lawyerdocuments",
  LawyerDocumentsSchema
);
