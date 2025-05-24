import { Availability, ScheduleSettings } from "../entities/Schedule.entity";

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
}
