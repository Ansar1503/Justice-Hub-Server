import mongoose, { Schema, Document } from "mongoose";

export interface IlawyerDocumentsModel extends Document {
  _id: string;
  user_id: string;
  enrollment_certificate: string;
  certificate_of_practice: string;
  bar_council_certificate: string;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerDocumentsSchema = new Schema<IlawyerDocumentsModel>(
  {
    _id: { type: String },
    bar_council_certificate: { type: String, required: true },
    enrollment_certificate: { type: String, required: true },
    certificate_of_practice: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const LawyerDocumentsModel = mongoose.model<IlawyerDocumentsModel>(
  "LawyerDocuments",
  LawyerDocumentsSchema
);
export default LawyerDocumentsModel;
