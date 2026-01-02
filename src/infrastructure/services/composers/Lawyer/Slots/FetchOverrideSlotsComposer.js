"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchOverrideSlotsComposer = FetchOverrideSlotsComposer;
const FetchOverrideSlotsController_1 = require("@interfaces/controller/Lawyer/Slots/FetchOverrideSlotsController");
const FetchOverrideSlotsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/FetchOverrideSlotsUseCase");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
function FetchOverrideSlotsComposer() {
    const usecase = new FetchOverrideSlotsUseCase_1.FetchOverrideSlotsUseCase(new OverrideSlotsRepo_1.OverrideSlotsRepository());
    return new FetchOverrideSlotsController_1.FetchOverrideSlots(usecase);
}
