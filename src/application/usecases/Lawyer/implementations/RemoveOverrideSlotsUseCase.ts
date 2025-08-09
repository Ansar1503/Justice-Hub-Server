import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IRemoveOverrideSlotUseCase } from "../IRemoveOverrideSlotsUseCase";
import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { STATUS_CODES } from "http";

export class RemoveOverrideSlots implements IRemoveOverrideSlotUseCase {
  constructor(private overrideRepo: IOverrideRepo) {}
  async execute(input: {
    lawyer_id: string;
    date: string;
  }): Promise<OverrideSlotsDto> {
    const inputDate = new Date(input.date);
    const overrideDate = new Date(
      inputDate.getTime() - inputDate.getTimezoneOffset() * 60000
    );
    const existingOverrideSlots = await this.overrideRepo.fetchOverrideSlots(
      input.lawyer_id
    );
    if (!existingOverrideSlots) {
      const error: any = new Error("Override slots not found");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }
    if (existingOverrideSlots.overrideDates.length === 0) {
      const error: any = new Error("No override slots available");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    if (
      existingOverrideSlots.overrideDates.find(
        (override) => override.date === overrideDate
      ) === undefined
    ) {
      const error: any = new Error("Override slot not found");
      error.code = STATUS_CODES.NOT_FOUND;
      throw error;
    }

    const updatedOverrideSlots = await this.overrideRepo.removeOverrideSlots(
      input.lawyer_id,
      overrideDate
    );
    if (!updatedOverrideSlots) throw new Error("Remvoe override slots failed");
    return {
      lawyer_id: updatedOverrideSlots.lawyerId,
      overrideDates: updatedOverrideSlots.overrideDates,
    };
  }
}
