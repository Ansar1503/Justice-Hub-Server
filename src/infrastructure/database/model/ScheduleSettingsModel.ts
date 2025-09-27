import mongoose, { Schema } from "mongoose";

export interface IscheduleSettingsModel extends Document {
  _id: string;
  lawyer_id: string;
  slotDuration: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const schedulesettings = new Schema<IscheduleSettingsModel>({
    _id: { type: String },
    lawyer_id: { type: String, required: true, unique: true },
    slotDuration: { type: Number, required: true, min: 15, max: 120 },
    maxDaysInAdvance: { type: Number, required: true, min: 15, max: 60 },
    autoConfirm: { type: Boolean, required: true, default: false },
});

export default mongoose.model<IscheduleSettingsModel>(
    "schedule_settings",
    schedulesettings
);
