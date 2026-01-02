"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAvailableSlotsComposer = UpdateAvailableSlotsComposer;
const UpdateAvailableSlots_1 = require("@interfaces/controller/Lawyer/Slots/UpdateAvailableSlots");
const UpdateAvailableSlotUseCase_1 = require("@src/application/usecases/Lawyer/implementations/UpdateAvailableSlotUseCase");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
function UpdateAvailableSlotsComposer() {
    const usecase = new UpdateAvailableSlotUseCase_1.UpdateAvailableSlotUseCase(new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new AvailableSlotsRepo_1.AvailableSlotRepository());
    return new UpdateAvailableSlots_1.UpdateAvailableSlotsController(usecase);
}
