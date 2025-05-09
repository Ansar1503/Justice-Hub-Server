export interface ScheduleSettings {
  lawyer_id: string;
  slotDuration: number;
  bufferTime?: number;
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

export interface ReccuringSchedule {
  lawyer_id: string;
  schedule: { day: Daytype; startTime: string; endTime: string; active: boolean }[];
}

export interface BlockedSchedule {
  lawyer_id: string;
  date: string;
  reason?: string;
}

export interface TimeSlot {
  lawyer_id: string;
  date: string;
  timeSlots: { startTime: string; endTime: string }[];
}
