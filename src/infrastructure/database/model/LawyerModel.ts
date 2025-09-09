import mongoose, { Schema, Document } from "mongoose";

export interface ILawyerModel extends Document {
  _id: string;
  userId: string;
  description: string;
  practiceAreas: string[];
  experience: number;
  specialisations: string[];
  consultationFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const LawyerSchema = new Schema<ILawyerModel>(
  {
    _id: { type: String },
    userId: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    practiceAreas: { type: [String], default: [] },
    experience: { type: Number, default: 0 },
    specialisations: { type: [String], default: [] },
    consultationFee: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerModel>("Lawyer", LawyerSchema);
