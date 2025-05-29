import { Availability, OverrideDate, OverrideSlots, ScheduleSettings } from "../entities/Schedule.entity";

export interface IScheduleRepo {
  updateScheduleSettings(
    payload: ScheduleSettings
  ): Promise<ScheduleSettings | null>;
  fetchScheduleSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
  updateAvailbleSlot(
    payload: Availability,
    lawyer_id: string
  ): Promise<Availability | null>;
  findAvailableSlots(lawyer_id: string): Promise<Availability | null>;
  addOverrideSlots(payload: OverrideDate[], lawyer_id: string): Promise<OverrideSlots | null>;
  fetchOverrideSlots(lawyer_id: string): Promise<OverrideSlots | null>;
  fetcghOverrideSlotByDate(lawyer_id: string, date: Date): Promise<OverrideSlots | null>;
  removeOverrideSlots(lawyer_id: string, id: string): Promise<OverrideSlots | null>;
}
