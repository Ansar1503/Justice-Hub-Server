import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSlotSettingsController } from "@interfaces/controller/Lawyer/Slots/FetchSlotSettingsController";
import { FetchSlotSettingsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchSlotSettingsUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";

export function FetchSlotSettingsComposer(): IController {
    const slotSettingsRepo = new ScheduleSettingsRepository();
    const usecase = new FetchSlotSettingsUseCase(slotSettingsRepo);
    return new FetchSlotSettingsController(usecase);
}
