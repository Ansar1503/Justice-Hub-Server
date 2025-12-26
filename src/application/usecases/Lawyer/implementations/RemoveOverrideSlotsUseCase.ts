import { STATUS_CODES } from "http";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IRemoveOverrideSlotUseCase } from "../IRemoveOverrideSlotsUseCase";

export class RemoveOverrideSlots implements IRemoveOverrideSlotUseCase {
    constructor(private _overrideRepo: IOverrideRepo) {}
    async execute(input: { lawyer_id: string; date: string }): Promise<OverrideSlotsDto> {
        const inputDate = new Date(input.date);
        const overrideDate = new Date(inputDate.getTime() - inputDate.getTimezoneOffset() * 60000);
        const existingOverrideSlots = await this._overrideRepo.fetchOverrideSlots(input.lawyer_id);
        // console.log("override slots", existingOverrideSlots);
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

        // if (
        //   existingOverrideSlots.overrideDates.find(
        //     (override) => override.date === overrideDate
        //   ) === undefined
        // ) {
        //   const error: any = new Error("Override slot not found");
        //   error.code = STATUS_CODES.NOT_FOUND;
        //   throw error;
        // }

        const updatedOverrideSlots = await this._overrideRepo.removeOverrideSlots(input.lawyer_id, overrideDate);
        if (!updatedOverrideSlots) throw new Error("Remvoe override slots failed");
        return {
            lawyer_id: updatedOverrideSlots.lawyerId,
            overrideDates: updatedOverrideSlots.overrideDates,
        };
    }
}
