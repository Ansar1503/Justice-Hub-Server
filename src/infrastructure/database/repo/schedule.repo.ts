import {
  BlockedSchedule,
  Daytype,
  ReccuringSchedule,
  ScheduleSettings,
  TimeSlot,
} from "../../../domain/entities/Schedule.entity";
import { IScheduleRepo } from "../../../domain/I_repository/I_schedule.repo";
import {
  availableSlotsModel,
  blockedScheduleModel,
  reccuringScheduleModel,
  scheduleSettingsModel,
} from "../model/schedule.model";

export class ScheduleRepository implements IScheduleRepo {
  async createBlockedSchedule(payload: BlockedSchedule): Promise<void> {
    await blockedScheduleModel.create(payload);
  }
  async deleteBlockedSchedule(id: string): Promise<void> {
    await blockedScheduleModel.findOneAndDelete({ _id: id });
  }
  async findBlockedSchedule(
    lawyer_id: string,
    date: string
  ): Promise<BlockedSchedule | null> {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    return await blockedScheduleModel.findOne({
      lawyer_id,
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
  async addRecurringShedule(payload: {
    lawyer_id: string;
    day: Daytype;
  }): Promise<void> {
    await reccuringScheduleModel.findOneAndUpdate(
      {
        lawyer_id: payload.lawyer_id,
      },
      {
        $push: {
          schedule: {
            day: payload.day,
          },
        },
      },
      { upsert: true }
    );
  }
  async findRecurringSchedule(
    lawyer_id: string,
    day?: Daytype
  ): Promise<ReccuringSchedule | null> {
    if (day) {
      return await reccuringScheduleModel.findOne({
        lawyer_id,
        schedule: { $elemMatch: { day } },
      });
    }
    return await reccuringScheduleModel.findOne({ lawyer_id });
  }
  // async fetchAllRecurringSchedule(
  //   lawyer_id: string
  // ): Promise<ReccuringSchedule[] | []> {
  //   return await reccuringScheduleModel.find({ lawyer_id });
  // }
  async removeRecurringSchedule(
    lawyer_id: string,
    day: Daytype
  ): Promise<void> {
    await reccuringScheduleModel.findOneAndUpdate(
      {
        lawyer_id,
      },
      {
        $pull: { schedule: { day } },
      }
    );
  }
  async updateRecurringSchedule(payload: {
    lawyer_id: string;
    day: Daytype;
    startTime?: string;
    endTime?: string;
    active?: boolean;
  }): Promise<void> {
    const updatequery: {
      "schedule.$.startTime"?: string;
      "schedule.$.endTime"?: string;
      "schedule.$.active"?: boolean;
    } = {};

    if (payload.startTime !== undefined && payload.startTime !== null) {
      updatequery["schedule.$.startTime"] = payload.startTime;
    }
    if (payload.endTime !== undefined && payload.endTime !== null) {
      updatequery["schedule.$.endTime"] = payload.endTime;
    }
    if (payload.active !== undefined && payload.active !== null) {
      updatequery["schedule.$.active"] = payload.active;
    }

    await reccuringScheduleModel.findOneAndUpdate(
      {
        lawyer_id: payload.lawyer_id,
        "schedule.day": payload.day,
      },
      {
        $set: updatequery,
      }
    );
  }
  // async fetchRecurringScheduleById(
  //   id: string
  // ): Promise<ReccuringSchedule | null> {
  //   return await reccuringScheduleModel.findOne({ _id: id });
  // }
  async updateScheduleSettings(payload: ScheduleSettings): Promise<void> {
    await scheduleSettingsModel.findOneAndUpdate(
      { lawyer_id: payload.lawyer_id },
      {
        $set: {
          slotDuration: payload.slotDuration,
          bufferTime: payload.bufferTime,
          maxDaysInAdvance: payload.maxDaysInAdvance,
          autoConfirm: payload.autoConfirm,
        },
      },
      { upsert: true }
    );
  }
  async fetchScheduleSettings(
    lawyer_id: string
  ): Promise<ScheduleSettings | null> {
    return await scheduleSettingsModel.findOne({ lawyer_id });
  }
  async findAvailableTimeSlot(
    lawyer_id: string,
    date: string
  ): Promise<TimeSlot | null> {
    return await availableSlotsModel.findOne({ lawyer_id, date });
  }
}
