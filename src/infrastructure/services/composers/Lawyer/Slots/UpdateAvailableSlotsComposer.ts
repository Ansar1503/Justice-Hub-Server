import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateAvailableSlotsController } from "@interfaces/controller/Lawyer/Slots/UpdateAvailableSlots";
import { UpdateAvailableSlotUseCase } from "@src/application/usecases/Lawyer/implementations/UpdateAvailableSlotUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";

export function UpdateAvailableSlotsComposer(): IController {
    const usecase = new UpdateAvailableSlotUseCase(
        new ScheduleSettingsRepository(),
        new AvailableSlotRepository()
    );
    return new UpdateAvailableSlotsController(usecase);
}
