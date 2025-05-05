import { BlockedSchedule } from "../entities/Schedule.entity";

export interface IScheduleRepo {
  createBlockedSchedule(payload: BlockedSchedule): Promise<void>;
  deleteBlockedSchedule(id: string): Promise<void>;
  findBlockedSchedule(date: string): Promise<BlockedSchedule | null>;
  findAllBlockedSchedule(lawyer_id:string): Promise<BlockedSchedule[] | []>;
}
