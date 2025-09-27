import mongoose, { Schema, Document } from "mongoose";

export interface IreviewModel extends Document {
  _id: string;
  review: string;
  session_id: string;
  heading: string;
  rating: number;
  active: boolean;
  client_id: string;
  lawyer_id: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IreviewModel>(
    {
        _id: { type: String },
        review: { type: String, required: true },
        session_id: { type: String, required: true },
        heading: { type: String, required: true },
        active: { type: Boolean, default: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        client_id: { type: String, required: true },
        lawyer_id: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IreviewModel>("reviews", reviewSchema);
