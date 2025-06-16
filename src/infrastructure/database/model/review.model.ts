import mongoose, { Schema, Document } from "mongoose";
import { Review } from "../../../domain/entities/Review.entity";

export interface IreviewModel extends Document, Review {}

const reviewSchema = new Schema({
  review: { type: String, required: true },
  session_id: { type: String, required: true, unique: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  client_id: { type: String, required: true },
  lawyer_id: { type: String, required: true },
});

export default mongoose.model<IreviewModel>("reviews", reviewSchema);
