export interface ScheduleSettings {
  lawyer_id: string;
  slotDuration: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
}
export type Daytype =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface BlockedSchedule {
  lawyer_id: string;
  date: string;
  reason?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export type Availability = {
  [key in Daytype]: DayAvailability;
};

export interface TimeSlot {
  lawyer_id: string;
  date: string;
  timeSlots: { startTime: string; endTime: string }[];
}

export interface OverrideDate {
  _id?:string;
  date: Date;
  isUnavailable: boolean;
  timeRanges?: { start: string; end: string }[];
}

export interface OverrideSlots {
  lawyer_id: string;
  overrideDates: OverrideDate[];
}
