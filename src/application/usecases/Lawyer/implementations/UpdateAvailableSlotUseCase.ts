import {
  AvailabilityInputDto,
  AvailabilityOutputDto,
} from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IUpdateAvailableSlotsUseCase } from "../IUpdateAvailableSlotsUseCase";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { STATUS_CODES } from "http";
import { timeStringToMinutes } from "@shared/utils/helpers/DateAndTimeHelper";
import { Availability } from "@domain/entities/Availability";

export class UpdateAvailableSlotUseCase
  implements IUpdateAvailableSlotsUseCase
{
  constructor(
    private scheduleSettings: IScheduleSettingsRepo,
    private availableSlotRepo: IAvailableSlots
  ) {}
  async execute(input: AvailabilityInputDto): Promise<AvailabilityOutputDto> {
    const settings = await this.scheduleSettings.fetchScheduleSettings(
      input.lawyer_id
    );
    if (!settings) {
      const error: any = new Error(
        "Settings not found, please create settings."
      );
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    for (const [day, data] of Object.entries(input)) {
      if (!data?.enabled) continue;

      const slots = data.timeSlots.map(
        (slot: { start: string; end: string }) => ({
          ...slot,
          startMin: timeStringToMinutes(slot.start),
          endMin: timeStringToMinutes(slot.end),
        })
      );

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
        if (Math.abs(slot.startMin - slot.endMin) < settings.slotDuration) {
          const error: any = new Error(
            `Slot duration should be at least ${settings.slotDuration} minutes.`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }

      const sorted = slots.sort(
        (a: { startMin: number }, b: { startMin: number }) =>
          a.startMin - b.startMin
      );

      for (let i = 0; i < sorted.length - 1; i++) {
        const current = sorted[i];
        const next = sorted[i + 1];
        if (current.endMin > next.startMin) {
          const error: any = new Error(
            `Time slot ${current.start}-${current.end} overlaps with ${next.start}-${next.end} on ${day}`
          );
          error.code = STATUS_CODES.BAD_REQUEST;
          throw error;
        }
      }
    }
    const availibilitypayload = Availability.create({
      lawyer_id: input.lawyer_id,
      monday: input.monday,
      tuesday: input.tuesday,
      wednesday: input.wednesday,
      thursday: input.thursday,
      friday: input.friday,
      saturday: input.saturday,
      sunday: input.sunday,
    });
    const updatedAvailability = await this.availableSlotRepo.updateAvailbleSlot(
      availibilitypayload
    );
    if (!updatedAvailability) throw new Error("availble slot updation failed");
    return {
      id: updatedAvailability.id,
      lawyer_id: updatedAvailability.lawyer_id,
      monday: updatedAvailability.getDayAvailability("monday"),
      tuesday: updatedAvailability.getDayAvailability("tuesday"),
      wednesday: updatedAvailability.getDayAvailability("wednesday"),
      thursday: updatedAvailability.getDayAvailability("thursday"),
      friday: updatedAvailability.getDayAvailability("friday"),
      saturday: updatedAvailability.getDayAvailability("saturday"),
      sunday: updatedAvailability.getDayAvailability("sunday"),
      createdAt: updatedAvailability.createdAt,
      updatedAt: updatedAvailability.updatedAt,
    };
  }
}
