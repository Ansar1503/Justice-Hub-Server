import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { CancelSessionController } from "@interfaces/controller/Lawyer/Sessions/CancelSessionController";

export function CancelSessionComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new CancelSessionController(usecase);
}
