import mongoose, { Schema, Document, Types } from "mongoose";
import { CallLogs } from "../../../domain/entities/CallLogs";

export interface IcallLogModel extends Omit<CallLogs, "session_id">, Document {
  session_id: Types.ObjectId;
}

const callLogsSchema = new Schema<IcallLogModel>(
  {
    roomId: { type: String, required: true },
    session_id: { type: Schema.Types.ObjectId, required: true, ref: "Session" },
    client_joined_at: { type: Date },
    client_left_at: { type: Date },
    lawyer_joined_at: { type: Date },
    lawyer_left_at: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    callDuration: { type: Number },
    end_reason: { type: String },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled", "missed", "dropped"],
      required: true,
      default: "ongoing",
    },
  },
  { timestamps: true }
);

export const CallLogsModel = mongoose.model<IcallLogModel>(
  "CallLogs",
  callLogsSchema
);
