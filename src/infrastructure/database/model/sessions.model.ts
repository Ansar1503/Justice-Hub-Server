import mongoose, { Schema, Document, Types } from "mongoose";
import {
  Session,
  SessionDocument,
} from "../../../domain/entities/Session.entity";

export interface ISessionModel extends Document, Omit<Session, "_id"> {}
export interface ISessionDocumentModel
  extends Document,
    Omit<SessionDocument, "_id" | "session_id" | "createdAt" | "updateAt"> {
  session_id: Types.ObjectId;
}

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
    room_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const documentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
});

const sessionDocumentSchema = new Schema<ISessionDocumentModel>(
  {
    session_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "sessions",
    },
    client_id: { type: String, required: true, ref: "clients" },
    document: [documentSchema],
  },
  { timestamps: true }
);

sessionSchema.index({ appointment_id: 1 }, { unique: true });

export const SessionModel = mongoose.model<ISessionModel>(
  "sessions",
  sessionSchema
);

export const SessionDocumentModel = mongoose.model<ISessionDocumentModel>(
  "session_documents",
  sessionDocumentSchema
);
