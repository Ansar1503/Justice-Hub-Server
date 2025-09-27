import { IController } from "@interfaces/controller/Interface/IController";
import { AddOverrideSlotsController } from "@interfaces/controller/Lawyer/Slots/AddOverrideSlotsController";
import { AddOverrideSlotsUseCase } from "@src/application/usecases/Lawyer/implementations/AddOverrideSlotsUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";

export function AddOverrideSlotsComposer(): IController {
    const usecase = new AddOverrideSlotsUseCase(new ScheduleSettingsRepository(), new OverrideSlotsRepository());
    return new AddOverrideSlotsController(usecase);
}
