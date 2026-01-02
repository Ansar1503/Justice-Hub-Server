"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveOverriedSlotsComposer = RemoveOverriedSlotsComposer;
const RemoveOverrideSlotsController_1 = require("@interfaces/controller/Lawyer/Slots/RemoveOverrideSlotsController");
const RemoveOverrideSlotsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/RemoveOverrideSlotsUseCase");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
function RemoveOverriedSlotsComposer() {
    const usecase = new RemoveOverrideSlotsUseCase_1.RemoveOverrideSlots(new OverrideSlotsRepo_1.OverrideSlotsRepository());
    return new RemoveOverrideSlotsController_1.RemoveOverrideSlotsController(usecase);
}
