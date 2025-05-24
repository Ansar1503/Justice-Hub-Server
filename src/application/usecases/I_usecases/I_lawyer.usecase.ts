import { lawyer } from "../../../domain/entities/Lawyer.entity";
import {
  Availability,
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

}
