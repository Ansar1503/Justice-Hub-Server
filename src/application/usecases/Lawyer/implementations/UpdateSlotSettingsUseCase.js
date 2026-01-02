"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSlotSettingsUseCase = void 0;
const ScheduleSettings_1 = require("@domain/entities/ScheduleSettings");
class UpdateSlotSettingsUseCase {
    SchduleSettingRepo;
    constructor(SchduleSettingRepo) {
        this.SchduleSettingRepo = SchduleSettingRepo;
    }
    async execute(input) {
        if (input.slotDuration > 120 || input.slotDuration < 15)
            throw new Error("INVALIDDURATION");
        if (input.maxDaysInAdvance < 15 || input.maxDaysInAdvance > 90)
            throw new Error("INVALIDADVANCE");
        const settingspayload = ScheduleSettings_1.ScheduleSettings.create({
            autoConfirm: input.autoConfirm,
            lawyer_id: input.lawyer_id,
            maxDaysInAdvance: input.maxDaysInAdvance,
            slotDuration: input.slotDuration,
        });
        const updatedSettings = await this.SchduleSettingRepo.updateScheduleSettings(settingspayload);
        return updatedSettings;
    }
}
exports.UpdateSlotSettingsUseCase = UpdateSlotSettingsUseCase;
