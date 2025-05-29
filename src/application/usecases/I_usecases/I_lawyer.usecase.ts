import { lawyer } from "../../../domain/entities/Lawyer.entity";
import {
  Availability,
  OverrideDate,

  OverrideSlots,

  ScheduleSettings,
} from "../../../domain/entities/Schedule.entity";

export interface Ilawyerusecase {
  verifyLawyer(payload: lawyer): Promise<lawyer>;
  fetchLawyerData(user_id: string): Promise<lawyer | null>;
  timeStringToMinutes(time: string): number;
  timeStringToMinutes(time: string): number;
  updateSlotSettings(
    payload: ScheduleSettings
  ): Promise<ScheduleSettings | null>;
  fetchSlotSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
  updateAvailableSlot(
    payload: Availability,
    lawyer_id: string
  ): Promise<Availability | null>;
  fetchAvailableSlots(lawyer_id: string): Promise<Availability | null>;
  addOverrideSlots(payload:OverrideDate[] ,lawyer_id: string): Promise<OverrideSlots  | null>;
  fetchOverrideSlots(lawyer_id:string):Promise<OverrideSlots | null>;
  removeOverrideSlots(lawyer_id: string, id: string): Promise<OverrideSlots | null>;
}
