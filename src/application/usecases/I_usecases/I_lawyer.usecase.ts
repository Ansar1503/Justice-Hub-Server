import { lawyer } from "../../../domain/entities/Lawyer.entity";
import {
  BlockedSchedule,
  Daytype,
  ReccuringSchedule,
  ScheduleSettings,
  TimeSlot,
} from "../../../domain/entities/Schedule.entity";

export interface Ilawyerusecase {
  verifyLawyer(payload: lawyer): Promise<lawyer>;
  fetchLawyerData(user_id: string): Promise<lawyer | null>;
  addBlockedSchedule(payload: BlockedSchedule): Promise<void>;
  fetchAllBlockedSchedule(lawyer_id: string): Promise<BlockedSchedule[] | []>;
  removeBlockedSchedule(id: string): Promise<void>;
  addRecurringSchedule({
    lawyer_id,
    day,
  }: {
    lawyer_id: string;
    day: Daytype;
  }): Promise<void>;
  fetchAllRecurringSlot(lawyer_id: string): Promise<ReccuringSchedule | null>;
  removeRecurringSlot(lawyer_id: string, id: string): Promise<void>;
  updateRecurringSlot(payload: {
    lawyer_id: string;
    startTime?: string;
    endTime?: string;
    active?: boolean;
  }): Promise<void>;
  timeStringToMinutes(time: string): number;
  timeStringToMinutes(time: string): number;
  updateSlotSettings(payload: ScheduleSettings): Promise<void>;
  fetchSlotSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
  addAvailableSlots(lawyer_id: string, date: string): Promise<void>;
  fetchAvailableSlot(lawyer_id: string, date: string): Promise<TimeSlot | null>;
  removeOneAvailableSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void>;
  updateAvailableSlot(payload: {
    lawyer_id: string;
    prev: { date: string; startTime: string; endTime: string };
    update: { key: "startTime" | "endTime"; value: string };
  }): Promise<void>;
  fetchAvailableSlotsByWeek(lawyer_id: string,weekStart:Date): Promise<{slots:TimeSlot[]|[],blocks:BlockedSchedule[]|[]}>;
  
}
