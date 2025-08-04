import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchOverrideSlots } from "@interfaces/controller/Lawyer/Slots/FetchOverrideSlotsController";

export function FetchOverrideSlotsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchOverrideSlots(usecase);
}
