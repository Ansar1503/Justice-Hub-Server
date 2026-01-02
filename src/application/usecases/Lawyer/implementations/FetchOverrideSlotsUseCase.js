"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchOverrideSlotsUseCase = void 0;
class FetchOverrideSlotsUseCase {
    overrideRepo;
    constructor(overrideRepo) {
        this.overrideRepo = overrideRepo;
    }
    async execute(input) {
        const existingOverrideSlots = await this.overrideRepo.fetchOverrideSlots(input);
        if (!existingOverrideSlots)
            return null;
        return {
            lawyer_id: existingOverrideSlots.lawyerId,
            overrideDates: existingOverrideSlots.overrideDates,
        };
    }
}
exports.FetchOverrideSlotsUseCase = FetchOverrideSlotsUseCase;
