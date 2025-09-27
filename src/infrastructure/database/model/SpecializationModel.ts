import mongoose, { Schema } from "mongoose";

export interface ISpecializationModel extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const specializationSchema = new Schema<ISpecializationModel>(
    {
        _id: { type: String },
        name: { type: String, required: true },
    },
    { timestamps: true }
);

export const SpecializationModel = mongoose.model<ISpecializationModel>(
    "specializations",
    specializationSchema
);
