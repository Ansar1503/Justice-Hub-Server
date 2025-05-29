import mongoose, { Schema, Document } from "mongoose";
import {
  Availability,
  DayAvailability,
  OverrideSlots,
  ScheduleSettings,
  TimeSlot,
} from "../../../domain/entities/Schedule.entity";

export interface IscheduleSettingsModel extends ScheduleSettings, Document {}
export interface IAvailabilityModel extends Availability, Document {
  lawyer_id: string;
}
export interface IOverrideSlotsModel extends OverrideSlots, Document {}

const timeSlotSchema = new Schema<TimeSlot>(
  {
    start: { type: String, required: true, default: "09:00" },
    end: { type: String, required: true, default: "17:00" },
  },
  { _id: false }
);

const dayScheduleSchema = new Schema<DayAvailability>(
  {
    enabled: { type: Boolean, required: true },
    timeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  { _id: false }
);

const AvailabilitySchema = new Schema<IAvailabilityModel>({
  lawyer_id: { type: String, required: true },
  monday: {
    type: dayScheduleSchema,
    required: true,
  },
  tuesday: {
    type: dayScheduleSchema,
    required: true,
  },
  wednesday: {
    type: dayScheduleSchema,
    required: true,
  },
  thursday: {
    type: dayScheduleSchema,
    required: true,
  },
  friday: {
    type: dayScheduleSchema,
    required: true,
  },
  saturday: {
    type: dayScheduleSchema,
    required: true,
  },
  sunday: {
    type: dayScheduleSchema,
    required: true,
  },
});

const schedulesettings = new Schema<IscheduleSettingsModel>({
  lawyer_id: { type: String, required: true },
  slotDuration: { type: Number, required: true, min: 15, max: 120 },
  maxDaysInAdvance: { type: Number, required: true, min: 15, max: 60 },
  autoConfirm: { type: Boolean, required: true, default: false },
});

const overrideDateSchema = new Schema({
  date: { type: Date, required: true },
  isUnavailable: { type: Boolean, required: true },
  timeRanges: [timeSlotSchema],
});

const overrideSlotSchema = new Schema(
  {
    lawyer_id: { type: String, required: true, unique: true },
    overrideDates: [overrideDateSchema],
  },
  { timestamps: true,  }
);

export const  overrideSlotsModel = mongoose.model<IOverrideSlotsModel>(
  "override_slots",
  overrideSlotSchema
);

export const availableSlotsModel = mongoose.model<IAvailabilityModel>(
  "available_schedule",
  AvailabilitySchema
);
export const scheduleSettingsModel = mongoose.model<IscheduleSettingsModel>(
  "schedule_settings",
  schedulesettings
);
