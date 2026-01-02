"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAvailableSlotsComposer = FetchAvailableSlotsComposer;
const FetchAvailableSlotsController_1 = require("@interfaces/controller/Lawyer/Slots/FetchAvailableSlotsController");
const FetchAvailableSlotsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/FetchAvailableSlotsUseCase");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
function FetchAvailableSlotsComposer() {
    const usecase = new FetchAvailableSlotsUseCase_1.FetchAvailableSlotsUseCase(new AvailableSlotsRepo_1.AvailableSlotRepository());
    return new FetchAvailableSlotsController_1.FetchAvailableSlotsController(usecase);
}
