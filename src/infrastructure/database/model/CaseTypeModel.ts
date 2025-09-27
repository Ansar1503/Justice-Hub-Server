import mongoose, { Schema } from "mongoose";

export interface ICasetypeModel {
  _id: string;
  name: string;
  practiceareaId: string;
  createdAt: Date;
  updatedAt: Date;
}

const casettypeSchema = new Schema<ICasetypeModel>(
    {
        _id: { type: String },
        name: { type: String, required: true },
        practiceareaId: { type: String, required: true, ref: "practiceareas" },
    },
    { timestamps: true }
);

export const CasetypeModel = mongoose.model<ICasetypeModel>(
    "casetypes",
    casettypeSchema
);
