export interface ScheduleSettings {
  lawyer_id: string;
  slotDuration: number;
  bufferTime: number;
  maxDaysInAdvance: number;
  autoConfirm: boolean;
}
type Daytype =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ReccuringSchedule {
  lawyer_id: string;
  day: Daytype;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface BlockedSchedule {
  lawyer_id: string;
  date: string;
  reason?: string;
}
