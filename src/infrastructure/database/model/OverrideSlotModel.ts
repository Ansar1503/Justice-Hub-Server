import mongoose, { Schema } from "mongoose";

interface OverrideDates {
  date: Date;
  isUnavailable: boolean;
  timeRanges: {
    start: string;
    end: string;
  }[];
}

export interface IOverrideSlotsModel extends Document {
  _id: string;
  lawyer_id: string;
  overrideDates: OverrideDates[];
  createdAt: Date;
  updatedAt: Date;
}

interface TimeSlot {
  start: string;
  end: string;
}
const timeSlotSchema = new Schema<TimeSlot>(
  {
    start: { type: String, required: true, default: "09:00" },
    end: { type: String, required: true, default: "17:00" },
  },
  { _id: false }
);

const overrideDateSchema = new Schema<OverrideDates>(
  {
    date: { type: Date, required: true },
    isUnavailable: { type: Boolean, required: true },
    timeRanges: [timeSlotSchema],
  },
  { _id: false }
);

const overrideSlotSchema = new Schema<IOverrideSlotsModel>(
  {
    _id: { type: String },
    lawyer_id: { type: String, required: true, unique: true },
    overrideDates: [overrideDateSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IOverrideSlotsModel>(
  "override_slots",
  overrideSlotSchema
);
