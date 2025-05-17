import { parse } from "date-fns";
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
    const updatedDate = new Date(
      new Date(payload.date).getTime() +
        Math.abs(new Date(payload.date).getTimezoneOffset() * 60000)
    );
    await blockedScheduleModel.create({
      lawyer_id: payload.lawyer_id,
      date: updatedDate,
      reason: payload.reason || "",
    });
  }
  async deleteBlockedSchedule(id: string): Promise<void> {
    await blockedScheduleModel.findOneAndDelete({ _id: id });
  }
  async findBlockedSchedule(
    lawyer_id: string,
    date: string
  ): Promise<BlockedSchedule | null> {
    const updateDate = new Date(
      new Date(date).getTime() +
        Math.abs(new Date(date).getTimezoneOffset() * 60000)
    );
    const start = new Date(updateDate);
    const end = new Date(updateDate);
    end.setDate(end.getDate() + 1);

    return await blockedScheduleModel.findOne({
      lawyer_id,
      date: {
        $gte: start,
        $lt: end,
      },
    });
  }
  async fetchBlockedScheduleByWeek(
    lawyer_id: string,
    startWeek: Date,
    endWeek: Date
  ): Promise<BlockedSchedule[] | []> {
    startWeek.setUTCHours(0, 0, 0, 0);
    endWeek.setUTCHours(23, 59, 59, 999);
    return await blockedScheduleModel.find({
      lawyer_id,
      date: {
        $gte: startWeek,
        $lt: endWeek,
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
    // console.log("actual date",date)
    const startOfDay = new Date(
      new Date(date).getTime() +
        Math.abs(new Date(date).getTimezoneOffset() * 60000)
    );
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(
      new Date(date).getTime() +
        Math.abs(new Date(date).getTimezoneOffset() * 60000)
    );
    endOfDay.setUTCHours(23, 59, 59, 999);

    return await availableSlotsModel.findOne({
      lawyer_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  }
  async addAvailableTimeSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    const date = new Date(payload.date);
    const updateDate = new Date(
      date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
    );
    const startOfDay = new Date(updateDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(updateDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    await availableSlotsModel.findOneAndUpdate(
      {
        lawyer_id: payload.lawyer_id,
        date: { $gte: startOfDay, $lte: endOfDay },
        "timeSlots.startTime": { $ne: payload.startTime },
        "timeSlots.endTime": { $ne: payload.endTime },
      },
      {
        date: updateDate,
        $push: {
          timeSlots: {
            startTime: payload.startTime,
            endTime: payload.endTime,
          },
        },
      },
      { upsert: true, new: true }
    );
  }

  async removeOneAvailableSlot(payload: {
    lawyer_id: string;
    date: string;
    startTime: string;
    endTime: string;
  }): Promise<void> {
    const updateDate = new Date(
      new Date(payload.date).getTime() +
        Math.abs(new Date(payload.date).getTimezoneOffset() * 60000)
    );
    const startOfDay = new Date(updateDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(updateDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    await availableSlotsModel.findOneAndUpdate(
      {
        lawyer_id: payload.lawyer_id,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      {
        $pull: {
          timeSlots: {
            startTime: payload.startTime,
            endTime: payload.endTime,
          },
        },
      }
    );
  }

  async updateAvailbleSlot(payload: {
    lawyer_id: string;
    prev: { date: string; startTime: string; endTime: string };
    update: { key: "startTime" | "endTime"; value: string };
  }): Promise<void> {
    const updateDate = new Date(
      new Date(payload.prev.date).getTime() +
        Math.abs(new Date(payload.prev.date).getTimezoneOffset() * 60000)
    );
    const startOfDay = new Date(updateDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(updateDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    await availableSlotsModel.findOneAndUpdate(
      {
        lawyer_id: payload.lawyer_id,
        date: { $gte: startOfDay, $lte: endOfDay },
        "timeSlots.startTime": payload.prev.startTime,
        "timeSlots.endTime": payload.prev.endTime,
      },
      { $set: { [`timeSlots.$.${payload.update.key}`]: payload.update.value } }
    );
  }
  async fetchAvailableSlotsByWeek(payload: {
    lawyer_id: string;
    startWeek: Date;
    endWeek: Date;
  }): Promise<TimeSlot[] | []> {
    payload.startWeek.setUTCHours(0, 0, 0, 0);
    payload.endWeek.setUTCHours(23, 59, 59, 999);
    const slots = await availableSlotsModel.find({
      lawyer_id: payload.lawyer_id,
      date: { $gte: payload.startWeek, $lte: payload.endWeek },
    });
    return slots;
  }
  async removeAllAvailableSlots(
    lawyer_id: string,
    date: string
  ): Promise<void> {
    const updateDate = new Date(
      new Date(date).getTime() +
        Math.abs(new Date(date).getTimezoneOffset() * 60000)
    );
    const startWeek = updateDate.setUTCHours(0, 0, 0, 0);
    const endWeek = updateDate.setUTCHours(23, 59, 59, 999);
    await availableSlotsModel.deleteOne({
      lawyer_id,
      date: { $gte: startWeek, $lte: endWeek },
    });
  }
}
