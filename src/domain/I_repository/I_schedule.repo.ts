import {
  BlockedSchedule,
  Daytype,
  ReccuringSchedule,
  ScheduleSettings,
  TimeSlot,
} from "../entities/Schedule.entity";

export interface IScheduleRepo {
  createBlockedSchedule(payload: BlockedSchedule): Promise<void>;
  deleteBlockedSchedule(id: string): Promise<void>;
  findBlockedSchedule(
    lawyer_id: string,
    date: string
  ): Promise<BlockedSchedule | null>;
  findAllBlockedSchedule(lawyer_id: string): Promise<BlockedSchedule[] | []>;
  fetchBlockedScheduleByWeek(
    lawyer_id: string,
    startWeek: Date,
    endWeek: Date
  ): Promise<BlockedSchedule[] | []>;
  addRecurringShedule(payload: {
    lawyer_id: string;
    day: Daytype;
  }): Promise<void>;
  findRecurringSchedule(
    lawyer_id: string,
    day?: Daytype
  ): Promise<ReccuringSchedule | null>;
  // fetchAllRecurringSchedule(
  //   lawyer_id: string
  // ): Promise<ReccuringSchedule[] | []>;
  // fetchRecurringScheduleById(id: string): Promise<ReccuringSchedule | null>;
  removeRecurringSchedule(lawyer_id: string, day: Daytype): Promise<void>;
  updateRecurringSchedule(payload: {
    lawyer_id: string;
    day: Daytype;
    startTime?: string;
    endTime?: string;
    active?: boolean;
  }): Promise<void>;
  updateScheduleSettings(payload: ScheduleSettings): Promise<void>;
  fetchScheduleSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
  findAvailableTimeSlot(
    lawyer_id: string,
    date: string
  ): Promise<TimeSlot | null>;
  addAvailableTimeSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void>;
  removeOneAvailableSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void>;
  removeAllAvailableSlots(lawyer_id: string, date: string): Promise<void>;
  updateAvailbleSlot(payload: {
    prev: { date: string; startTime: string; endTime: string };
    update: { key: "startTime" | "endTime"; value: string };
  }): Promise<void>;
  fetchAvailableSlotsByWeek(payload: {
    lawyer_id: string;
    startWeek: Date;
    endWeek: Date;
  }): Promise<TimeSlot[] | []>;
}
