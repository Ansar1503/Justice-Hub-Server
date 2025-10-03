import mongoose, { Schema, Document } from "mongoose";

interface DocumentItem {
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface ICaseDocumentModel extends Document {
  _id: string;
  caseId: string;
  uploadBy: string;
  document: DocumentItem;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentItemSchema = new Schema<DocumentItem>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const caseDocumentSchema = new Schema<ICaseDocumentModel>(
  {
    _id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    caseId: { type: String, required: true, ref: "cases" },
    uploadBy: { type: String, required: true },
    document: { type: DocumentItemSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICaseDocumentModel>(
  "caseDocuments",
  caseDocumentSchema
);
