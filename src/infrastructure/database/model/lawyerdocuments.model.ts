import mongoose, { Schema, Document } from "mongoose";
import { LawyerDocuments } from "../../../domain/entities/Lawyer.entity";

export interface IlawyerDocumentsModel
  extends Omit<Document, "_id">,
    LawyerDocuments {
  _id: string;
}

const LawyerDocumentsSchema = new Schema(
  {
    bar_council_certificate: { type: String, required: false },
    enrollment_certificate: { type: String, required: false },
    certificate_of_practice: { type: String, required: false },
    user_id: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const LawyerDocumentsModel = mongoose.model<IlawyerDocumentsModel>(
  "LawyerDocuments",
  LawyerDocumentsSchema
);
export default LawyerDocumentsModel;
