import e from "express";
import mongoose, { Schema, Document } from "mongoose";

interface TimeSlot {
    start: string;
    end: string;
}

interface DayAvailability {
    enabled: boolean;
    timeSlots: TimeSlot[];
}

export interface IAvailabilityModel extends Document {
    _id: string;
    lawyer_id: string;
    monday: DayAvailability;
    tuesday: DayAvailability;
    wednesday: DayAvailability;
    thursday: DayAvailability;
    friday: DayAvailability;
    saturday: DayAvailability;
    sunday: DayAvailability;
    createdAt: Date;
    updatedAt: Date;
}

const timeSlotSchema = new Schema<TimeSlot>(
    {
        start: { type: String, required: true, default: "09:00" },
        end: { type: String, required: true, default: "17:00" },
    },
    { _id: false },
);

const dayScheduleSchema = new Schema<DayAvailability>(
    {
        enabled: { type: Boolean, required: true, default: false },
        timeSlots: { type: [timeSlotSchema], default: [] },
    },
    { _id: false },
);

const AvailabilitySchema = new Schema<IAvailabilityModel>(
    {
        _id: { type: String },
        lawyer_id: { type: String, required: true, unique: true },
        monday: { type: dayScheduleSchema, required: true },
        tuesday: { type: dayScheduleSchema, required: true },
        wednesday: { type: dayScheduleSchema, required: true },
        thursday: { type: dayScheduleSchema, required: true },
        friday: { type: dayScheduleSchema, required: true },
        saturday: { type: dayScheduleSchema, required: true },
        sunday: { type: dayScheduleSchema, required: true },
    },
    { timestamps: true },
);

export default mongoose.model<IAvailabilityModel>("available_schedule", AvailabilitySchema);
