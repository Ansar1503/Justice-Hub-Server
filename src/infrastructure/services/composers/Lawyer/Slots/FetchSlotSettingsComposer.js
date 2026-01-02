"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSlotSettingsComposer = FetchSlotSettingsComposer;
const FetchSlotSettingsController_1 = require("@interfaces/controller/Lawyer/Slots/FetchSlotSettingsController");
const FetchSlotSettingsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/FetchSlotSettingsUseCase");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
function FetchSlotSettingsComposer() {
    const slotSettingsRepo = new ScheduleSettingsRepo_1.ScheduleSettingsRepository();
    const usecase = new FetchSlotSettingsUseCase_1.FetchSlotSettingsUseCase(slotSettingsRepo);
    return new FetchSlotSettingsController_1.FetchSlotSettingsController(usecase);
}
