"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLawyerSlotSettingsComposer = UpdateLawyerSlotSettingsComposer;
const UpdateSlotSettingsController_1 = require("@interfaces/controller/Lawyer/Slots/UpdateSlotSettingsController");
const UpdateSlotSettingsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/UpdateSlotSettingsUseCase");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
function UpdateLawyerSlotSettingsComposer() {
    const scheduleSettingsRepo = new ScheduleSettingsRepo_1.ScheduleSettingsRepository();
    const usecase = new UpdateSlotSettingsUseCase_1.UpdateSlotSettingsUseCase(scheduleSettingsRepo);
    return new UpdateSlotSettingsController_1.UpdateLawyerSlotSettingsController(usecase);
}
