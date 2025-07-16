import mongoose, { Schema, Document, Types } from "mongoose";
import { Disputes } from "../../../domain/entities/Disputes";

export interface IDisputesModel extends Document, Omit<Disputes, "contentId"> {
  contentId: Types.ObjectId;
}

const diputesSchema = new Schema<IDisputesModel>(
  {
    disputeType: {
      type: String,
      required: true,
      enum: ["reviews", "messages"],
    },
    contentId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "disputeType",
    },
    reason: { type: String, required: true },
    reportedBy: { type: String, required: true },
    reportedUser: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const DisputesModel = mongoose.model<IDisputesModel>(
  "Disputes",
  diputesSchema
);
