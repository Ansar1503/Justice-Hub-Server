import mongoose, { Schema, Document } from "mongoose";
import { Session } from "../../../domain/entities/Session.entity";

export interface ISessionModel extends Document, Omit<Session, "_id"> {}

const sessionSchema = new Schema(
  {
    appointment_id: {
      type: String,
      required: true,
    },
    lawyer_id: {
      type: String,
      required: true,
    },
    client_id: {
      type: String,
      required: true,
    },
    scheduled_date: {
      type: Date,
      required: true,
    },
    scheduled_time: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 15,
    },
    reason: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["consultation", "follow-up"],
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "ongoing", "completed", "cancelled", "missed"],
      default: "upcoming",
    },
    start_time: {
      type: Date,
      required: false,
    },
    end_time: {
      type: Date,
      required: false,
    },
    client_joined_at: {
      type: Date,
      required: false,
    },
    lawyer_joined_at: {
      type: Date,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    summary: {
      type: String,
      required: false,
    },
    follow_up_suggested: {
      type: Boolean,
      default: false,
    },
    follow_up_session_id: {
      type: Schema.Types.ObjectId,
      ref: "sessions",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ appointment_id: 1 }, { unique: true });
// sessionSchema.virtual("scheduled_end").get(function () {
//   return new Date(this.scheduled_date.getTime() + this.duration * 60000);
// });

export const SessionModel = mongoose.model<ISessionModel>(
  "sessions",
  sessionSchema
);
