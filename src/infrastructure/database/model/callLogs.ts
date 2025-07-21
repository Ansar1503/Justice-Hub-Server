import mongoose, { Schema, Document, Types } from "mongoose";
import { CallLogs } from "../../../domain/entities/CallLogs";

export interface IcallLogModel extends Omit<CallLogs, "session_id">, Document {
  session_id: Types.ObjectId;
}

const callLogsSchema = new Schema<IcallLogModel>(
  {
    session_id: { type: Schema.Types.ObjectId, required: true, ref: "Session" },
    client_joined_at: { type: Date },
    client_left_at: { type: Date },
    lawyer_joined_at: { type: Date },
    lawyer_left_at: { type: Date },
    start_time: { type: Date },
    end_time: { type: Date },
    duration: { type: Number },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled", "missed", "dropped"],
      required: true,
      default: "ongoing",
    },
    room_id: { type: String, required: true },
  },
  { timestamps: true }
);

export const CallLogsModel = mongoose.model<IcallLogModel>(
  "CallLogs",
  callLogsSchema
);
