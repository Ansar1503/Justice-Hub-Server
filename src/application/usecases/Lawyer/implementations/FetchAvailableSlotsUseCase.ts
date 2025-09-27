import { AvailabilityOutputDto } from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IFetchAvailableSlotsUseCase } from "../IFetchAvailableSlotsUseCase";

export class FetchAvailableSlotsUseCase implements IFetchAvailableSlotsUseCase {
    constructor(private AvailableSlotRepo: IAvailableSlots) {}
    async execute(input: string): Promise<AvailabilityOutputDto> {
        const availability = await this.AvailableSlotRepo.findAvailableSlots(input);
        if (!availability) throw new Error("Availble Slots not found");
        return {
            id: availability.id,
            lawyer_id: availability.lawyer_id,
            monday: availability.getDayAvailability("monday"),
            tuesday: availability.getDayAvailability("tuesday"),
            wednesday: availability.getDayAvailability("wednesday"),
            thursday: availability.getDayAvailability("thursday"),
            friday: availability.getDayAvailability("friday"),
            saturday: availability.getDayAvailability("saturday"),
            sunday: availability.getDayAvailability("sunday"),
            createdAt: availability.createdAt,
            updatedAt: availability.updatedAt,
        };
    }
}
