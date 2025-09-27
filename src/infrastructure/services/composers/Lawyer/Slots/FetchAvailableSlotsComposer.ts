import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAvailableSlotsController } from "@interfaces/controller/Lawyer/Slots/FetchAvailableSlotsController";
import { FetchAvailableSlotsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchAvailableSlotsUseCase";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";

export function FetchAvailableSlotsComposer(): IController {
    const usecase = new FetchAvailableSlotsUseCase(new AvailableSlotRepository());
    return new FetchAvailableSlotsController(usecase);
}
