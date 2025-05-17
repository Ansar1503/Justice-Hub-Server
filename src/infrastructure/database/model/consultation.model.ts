import { Consultation } from "../../../domain/entities/Consultation.entity";
import mongoose, { Schema, Document } from "mongoose";

export interface IConsultation extends Document, Consultation {}

const consultationSchema = new Schema({
  lawyer_id: { type: String, required: true },
  client_id: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
  },
});
