import { Appointment } from "../../../domain/entities/Appointment.entity";
import mongoose, { Schema, Document } from "mongoose";

export interface IAppointmentModel extends Document, Appointment {}

const appoinmentSchema = new Schema({
  lawyer_id: { type: String, required: true },
  client_id: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  document: { type: String, required: false },
  reason: { type: String, required: true },
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
});
