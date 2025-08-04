import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { UpdateLawyerSlotSettingsController } from "@interfaces/controller/Lawyer/Slots/UpdateSlotSettingsController";

export function UpdateLawyerSlotSettingsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new UpdateLawyerSlotSettingsController(usecase);
}
