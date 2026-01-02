"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddOverrideSlotsComposer = AddOverrideSlotsComposer;
const AddOverrideSlotsController_1 = require("@interfaces/controller/Lawyer/Slots/AddOverrideSlotsController");
const AddOverrideSlotsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/AddOverrideSlotsUseCase");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
function AddOverrideSlotsComposer() {
    const usecase = new AddOverrideSlotsUseCase_1.AddOverrideSlotsUseCase(new ScheduleSettingsRepo_1.ScheduleSettingsRepository(), new OverrideSlotsRepo_1.OverrideSlotsRepository());
    return new AddOverrideSlotsController_1.AddOverrideSlotsController(usecase);
}
