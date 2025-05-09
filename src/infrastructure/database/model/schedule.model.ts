import mongoose, { Schema, Document } from "mongoose";
import {
  BlockedSchedule,
  ReccuringSchedule,
  ScheduleSettings,
  TimeSlot,
} from "../../../domain/entities/Schedule.entity";

export interface IscheduleSettingsModel extends ScheduleSettings, Document {}
export interface IreccuringScheduleModel extends Document, ReccuringSchedule {}
export interface IblockedScheduleModel extends Document, BlockedSchedule {}
export interface ITimeSlotModel extends Document, TimeSlot {}

const schedulesettings = new Schema({
  lawyer_id: { type: String, required: true },
  slotDuration: { type: Number, required: true, min: 15, max: 120 },
  bufferTime: { type: Number, required: false, max: 60, default: 0 },
  maxDaysInAdvance: { type: Number, required: true, min: 7, max: 90 },
  autoConfirm: { type: Boolean, required: true, default: false },
});

const reccuringSchedule = new Schema({
  lawyer_id: { type: String, required: true },
  schedule: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },

      startTime: { type: String, required: true, default: "09:00" },
      endTime: { type: String, required: true, default: "17:00" },
      active: { type: Boolean, required: true, default: true },
    },
  ],
});

const blockedSchedule = new Schema({
  lawyer_id: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: false },
});

const timeSlots = new Schema({
  lawyer_id: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlots: [
    {
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

export const availableSlotsModel = mongoose.model<ITimeSlotModel>(
  "available_schedule",
  timeSlots
);
export const scheduleSettingsModel = mongoose.model<IscheduleSettingsModel>(
  "schedule_settings",
  schedulesettings
);
export const reccuringScheduleModel = mongoose.model<IreccuringScheduleModel>(
  "reccurring_schedules",
  reccuringSchedule
);
export const blockedScheduleModel = mongoose.model<IblockedScheduleModel>(
  "blockedSchedule",
  blockedSchedule
);
