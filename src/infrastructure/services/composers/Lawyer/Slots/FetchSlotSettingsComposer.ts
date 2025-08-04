import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchSlotSettingsController } from "@interfaces/controller/Lawyer/Slots/FetchSlotSettingsController";

export function FetchSlotSettingsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchSlotSettingsController(usecase);
}
