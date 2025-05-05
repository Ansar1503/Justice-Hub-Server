import { BlockedSchedule } from "../../../domain/entities/Schedule.entity";
import { IScheduleRepo } from "../../../domain/I_repository/I_schedule.repo";
import { blockedScheduleModel } from "../model/schedule.model";

export class ScheduleRepository implements IScheduleRepo {
  async createBlockedSchedule(payload: BlockedSchedule): Promise<void> {
    await blockedScheduleModel.create(payload);
  }
  async deleteBlockedSchedule(id: string): Promise<void> {
    await blockedScheduleModel.findOneAndDelete({ _id: id });
  }
  async findBlockedSchedule(date: string): Promise<BlockedSchedule | null> {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    return await blockedScheduleModel.findOne({
      date: {
        $gte: start,
        $lt: end,
      },
    });
  }
  async findAllBlockedSchedule(
    lawyer_id: string
  ): Promise<BlockedSchedule[] | []> {
    return await blockedScheduleModel.find({ lawyer_id });
  }
}
