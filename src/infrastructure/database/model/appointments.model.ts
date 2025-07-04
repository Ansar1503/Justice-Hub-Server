import { Appointment } from "../../../domain/entities/Appointment.entity";
import mongoose, { Schema, Document } from "mongoose";

export interface IAppointmentModel extends Document, Appointment {}

const appointmentSchema = new Schema(
  {
    lawyer_id: { type: String, required: true },
    client_id: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    reason: { type: String, required: true },
    amount: { type: Number, required: true, min: 10 },
    type: {
      type: String,
      required: true,
      enum: ["consultation", "follow-up"],
    },
    payment_status: {
      type: String,
      required: true,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ lawyer_id: 1, date: 1, time: 1 }, { unique: true });

export const AppointmentModel = mongoose.model<IAppointmentModel>(
  "appointments",
  appointmentSchema
);
