import mongoose,{Schema,Document} from "mongoose";
import { lawyer } from "../../../domain/entities/Lawyer.entity";

export interface ILawyerModel extends Document, lawyer {
  user_id: string;
}

const LawyerSchema = new Schema(
  {
    user_id: { type: String, required: true },
    description: { type: String, required: false },
    barcouncil_number: { type: String, required: false },
    practice_areas: { type: [String], required: false },
    experience: { type: Number, required: false },
    specialisation: { type: [String], required: false },
    consultation_fee: { type: Number, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<ILawyerModel>("Lawyer", LawyerSchema);