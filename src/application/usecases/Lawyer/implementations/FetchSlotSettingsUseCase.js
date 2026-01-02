"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSlotSettingsUseCase = void 0;
class FetchSlotSettingsUseCase {
    scheduleSettingsRepo;
    constructor(scheduleSettingsRepo) {
        this.scheduleSettingsRepo = scheduleSettingsRepo;
    }
    async execute(input) {
        const settings = await this.scheduleSettingsRepo.fetchScheduleSettings(input);
        if (!settings)
            return null;
        return {
            autoConfirm: settings.autoConfirm,
            createdAt: settings.createdAt,
            id: settings.id,
            lawyer_id: settings.lawyerId,
            maxDaysInAdvance: settings.maxDaysInAdvance,
            slotDuration: settings.slotDuration,
            updatedAt: settings.updatedAt,
        };
    }
}
exports.FetchSlotSettingsUseCase = FetchSlotSettingsUseCase;
