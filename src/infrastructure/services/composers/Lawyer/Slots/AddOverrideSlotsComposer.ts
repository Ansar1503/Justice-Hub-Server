import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { AddOverrideSlotsController } from "@interfaces/controller/Lawyer/Slots/AddOverrideSlotsController";

export function AddOverrideSlotsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new AddOverrideSlotsController(usecase);
}
