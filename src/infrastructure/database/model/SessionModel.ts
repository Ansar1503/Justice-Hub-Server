import mongoose, { Schema } from "mongoose";

export interface ISessionModel extends Document {
  _id: string;
  appointment_id: string;
  lawyer_id: string;
  client_id: string;
  scheduled_date: Date;
  scheduled_time: string;
  duration: number;
  reason: string;
  amount: number;
  type: "consultation" | "follow-up";
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "missed";
  notes?: string;
  summary?: string;
  follow_up_suggested?: boolean;
  follow_up_session_id?: string;
  room_id?: string;
  start_time?: Date;
  end_time?: Date;
  client_joined_at: Date;
  client_left_at: Date;
  lawyer_joined_at: Date;
  lawyer_left_at: Date;
  end_reason: string;
  callDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISessionModel>(
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
    notes: {
      type: String,
    },
    summary: {
      type: String,
    },
    follow_up_suggested: {
      type: Boolean,
      default: false,
    },
    follow_up_session_id: {
      type: String,
      ref: "sessions",
    },
    room_id: {
      type: String,
    },
    start_time: {
      type: Date,
    },
    end_time: {
      type: Date,
    },
    client_joined_at: { type: Date },
    client_left_at: { type: Date },
    lawyer_joined_at: { type: Date },
    lawyer_left_at: { type: Date },
    end_reason: { type: String },
    callDuration: { type: Number },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({ appointment_id: 1 }, { unique: true });

export default mongoose.model<ISessionModel>("sessions", sessionSchema);
