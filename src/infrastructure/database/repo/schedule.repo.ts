import { parse } from "date-fns";
import {
  Availability,
  ScheduleSettings,
} from "../../../domain/entities/Schedule.entity";
import { IScheduleRepo } from "../../../domain/I_repository/I_schedule.repo";
import {
  availableSlotsModel,
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
}
