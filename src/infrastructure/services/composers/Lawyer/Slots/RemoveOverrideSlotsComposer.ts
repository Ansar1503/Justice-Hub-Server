import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { RemoveOverrideSlotsController } from "@interfaces/controller/Lawyer/Slots/RemoveOverrideSlotsController";

export function RemoveOverriedSlotsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new RemoveOverrideSlotsController(usecase);
}
