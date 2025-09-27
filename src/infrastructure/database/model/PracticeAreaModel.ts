import mongoose, { Schema } from "mongoose";

export interface IPracticeareaModel extends Document {
  _id: string;
  name: string;
  specializationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const practiceareaSchema = new Schema<IPracticeareaModel>(
    {
        _id: { type: String },
        name: { type: String, required: true },
        specializationId: { type: String, required: true, ref: "specializations" },
    },
    { timestamps: true }
);

export const practiceareaModel = mongoose.model<IPracticeareaModel>(
    "practiceareas",
    practiceareaSchema
);
