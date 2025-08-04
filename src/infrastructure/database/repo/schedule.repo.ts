import { parse } from "date-fns";
import {
  Availability,
  OverrideDate,
  OverrideSlots,
  ScheduleSettings,
} from "../../../domain/entities/Schedule.entity";
import { IScheduleRepo } from "../../../domain/IRepository/I_schedule.repo";
import {
  availableSlotsModel,
  overrideSlotsModel,
  scheduleSettingsModel,
} from "../model/schedule.model";

export class ScheduleRepository implements IScheduleRepo {
  async updateScheduleSettings(
    payload: ScheduleSettings
  ): Promise<ScheduleSettings | null> {
    const update = await scheduleSettingsModel.findOneAndUpdate(
      { lawyer_id: payload.lawyer_id },
      {
        $set: {
          slotDuration: payload.slotDuration,
          maxDaysInAdvance: payload.maxDaysInAdvance,
          autoConfirm: payload.autoConfirm,
        },
      },
      { upsert: true, new: true }
    );
    return update;
  }
  async fetchScheduleSettings(
    lawyer_id: string
  ): Promise<ScheduleSettings | null> {
    return await scheduleSettingsModel.findOne({ lawyer_id });
  }

  async updateAvailbleSlot(
    payload: Availability,
    lawyer_id: string
  ): Promise<Availability | null> {
    return await availableSlotsModel.findOneAndUpdate(
      {
        lawyer_id: lawyer_id,
      },
      { $set: payload },
      { upsert: true, new: true }
    );
  }
  async findAvailableSlots(lawyer_id: string): Promise<Availability | null> {
    return await availableSlotsModel.findOne({ lawyer_id });
  }
  async addOverrideSlots(
    payload: OverrideDate[],
    lawyer_id: string
  ): Promise<OverrideSlots | null> {
    return await overrideSlotsModel.findOneAndUpdate(
      { lawyer_id: lawyer_id },
      { $push: { overrideDates: payload } },
      { upsert: true, new: true }
    );
  }
  async fetchOverrideSlots(lawyer_id: string): Promise<OverrideSlots | null> {
    return await overrideSlotsModel.findOne({ lawyer_id });
  }
  async removeOverrideSlots(
    lawyer_id: string,
    id: string
  ): Promise<OverrideSlots | null> {
    return await overrideSlotsModel.findOneAndUpdate(
      { lawyer_id: lawyer_id },
      { $pull: { overrideDates: { _id: id } } },
      { new: true }
    );
  }

  async fetcghOverrideSlotByDate(
    lawyer_id: string,
    date: Date
  ): Promise<OverrideSlots | null> {
    const inputDate = new Date(date);
    const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999));
    
    const overrideSlots = await overrideSlotsModel.findOne(
      {
        lawyer_id,
        overrideDates: {
          $elemMatch: {
            date: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
      },
      {
        "overrideDates.$": 1,
      }
    );

    return overrideSlots
  }
}
