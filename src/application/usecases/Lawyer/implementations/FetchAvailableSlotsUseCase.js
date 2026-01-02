"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAvailableSlotsUseCase = void 0;
class FetchAvailableSlotsUseCase {
    AvailableSlotRepo;
    constructor(AvailableSlotRepo) {
        this.AvailableSlotRepo = AvailableSlotRepo;
    }
    async execute(input) {
        const availability = await this.AvailableSlotRepo.findAvailableSlots(input);
        if (!availability)
            throw new Error("Availble Slots not found");
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
exports.FetchAvailableSlotsUseCase = FetchAvailableSlotsUseCase;
