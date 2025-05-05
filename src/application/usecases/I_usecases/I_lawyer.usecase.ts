import { lawyer } from "../../../domain/entities/Lawyer.entity";
import { BlockedSchedule } from "../../../domain/entities/Schedule.entity";

export interface Ilawyerusecase {
  verifyLawyer(payload: lawyer): Promise<lawyer>;
  fetchLawyerData(user_id: string): Promise<lawyer | null>;
  addBlockedSchedule(payload: BlockedSchedule): Promise<void>;
  fetchAllBlockedSchedule(lawyer_id: string): Promise<BlockedSchedule[] | []>;
  removeBlockedSchedule(id: string): Promise<void>;
}
