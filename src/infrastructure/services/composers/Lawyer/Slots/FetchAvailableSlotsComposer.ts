import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchAvailableSlotsController } from "@interfaces/controller/Lawyer/Slots/FetchAvailableSlotsController";

export function FetchAvailableSlotsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchAvailableSlotsController(usecase);
}
