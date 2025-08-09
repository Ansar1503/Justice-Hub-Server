import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateLawyerSlotSettingsController } from "@interfaces/controller/Lawyer/Slots/UpdateSlotSettingsController";
import { UpdateSlotSettingsUseCase } from "@src/application/usecases/Lawyer/implementations/UpdateSlotSettingsUseCase";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";

export function UpdateLawyerSlotSettingsComposer(): IController {
  const scheduleSettingsRepo = new ScheduleSettingsRepository()
  const usecase = new UpdateSlotSettingsUseCase(scheduleSettingsRepo)
  return new UpdateLawyerSlotSettingsController(usecase);
}
