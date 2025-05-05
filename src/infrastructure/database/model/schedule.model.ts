import mongoose, { Schema, Document } from "mongoose";
import {
  BlockedSchedule,
  ReccuringSchedule,
  ScheduleSettings,
} from "../../../domain/entities/Schedule.entity";

export interface IscheduleSettingsModel extends ScheduleSettings, Document {}
export interface IreccuringScheduleModel extends Document, ReccuringSchedule {}
export interface IblockedScheduleModel extends Document, BlockedSchedule {}

const schedulesettings = new Schema({
  lawyer_id: { type: String, required: true },
  slotDuration: { type: Number, required: true, min: 30, max: 120 },
  bufferTime: { type: Number, required: true, min: 20, max: 60 },
  maxDaysInAdvance: { type: Number, required: true, min: 20, max: 90 },
  autoConfirm: { type: Boolean, required: true, default: false },
});

export const scheduleSettingsModel = mongoose.model<IscheduleSettingsModel>(
  "schedule_settings",
  schedulesettings
);

const reccuringSchedule = new Schema({
  lawyer_id: { type: String, required: true },
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

  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
});

export const reccuringScheduleModel = mongoose.model<IreccuringScheduleModel>(
  "reccurring_schedules",
  reccuringSchedule
);

const blockedSchedule = new Schema({
  lawyer_id: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: false },
});

export const blockedScheduleModel = mongoose.model<IblockedScheduleModel>(
  "blockedSchedule",
  blockedSchedule
);
