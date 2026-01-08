import { STATUS_CODES } from "http";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { timeStringToMinutes } from "@shared/utils/helpers/DateAndTimeHelper";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { Override } from "@domain/entities/Override";
import { IAddOverrideSlotsUseCase } from "../IAddOverrideSlotsUseCase";

export class AddOverrideSlotsUseCase implements IAddOverrideSlotsUseCase {
  constructor(
    private slotSettingsRepo: IScheduleSettingsRepo,
    private overrideSlotRepo: IOverrideRepo
  ) {}
  async execute(input: OverrideSlotsDto): Promise<OverrideSlotsDto> {
    input.overrideDates.forEach((oveerride) => {
      oveerride.date = new Date(
        oveerride.date.getTime() - oveerride.date.getTimezoneOffset() * 60000
      );
    });
    const slotSettings = await this.slotSettingsRepo.fetchScheduleSettings(
      input.lawyer_id
    );
    if (!slotSettings) {
      const error: any = new Error(
        "Settings not found, please create settings."
      );
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    const map: any = new Map();
    for (const override of input.overrideDates) {
      if (map.has(override.date)) {
        const error: any = new Error(
          `Duplicate override date found: ${override.date}`
        );
        error.code = STATUS_CODES.BAD_REQUEST;
        throw error;
      } else {
        map.set(override.date);
      }
    }
    map.clear();
    const timeRanges = input.overrideDates[0].timeRanges;
    if (timeRanges && timeRanges.length > 0) {
      const slots = timeRanges.map((time) => ({
        ...time,
        startMin: timeStringToMinutes(time.start),
        endMin: timeStringToMinutes(time.end),
      }));
      const now = new Date();
      const todayStr = now.toDateString();
      const bufferMinutes = 5;
      const nowMinutes = now.getHours() * 60 + now.getMinutes() + bufferMinutes;

      for (const slot of slots) {
        if (slot.startMin < 0 || slot.endMin > 1440) {
          const error: any = new Error(
            "Time should be between 00:00 and 23:59."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (slot.startMin >= slot.endMin) {
          const error: any = new Error(
            "Start time should be less than end time."
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        if (Math.abs(slot.startMin - slot.endMin) < slotSettings.slotDuration) {
          const error: any = new Error(
            `Slot duration should be at least ${slotSettings.slotDuration} minutes.`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
        for (const override of input.overrideDates) {
          const isToday = override.date.toDateString() === todayStr;

          if (isToday && slot.startMin < nowMinutes) {
            const error: any = new Error(
              "Cannot create override for a past time. Please select a time at least 5 minutes from now."
            );
            error.code = STATUS_CODES.BAD_REQUEST;
            throw error;
          }
        }
      }

      const sorted = slots.sort((a, b) => a.startMin - b.startMin);

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (current.endMin > next.startMin) {
          const error: any = new Error(
            `Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end}`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }
    }

    const overridePayload = Override.create(input);
    const updatedOverrideSlots =
      await this.overrideSlotRepo.addOverrideSlots(overridePayload);
    if (!updatedOverrideSlots) throw new Error("update failed");
    return {
      lawyer_id: updatedOverrideSlots.lawyerId,
      overrideDates: updatedOverrideSlots.overrideDates,
    };
  }
}
