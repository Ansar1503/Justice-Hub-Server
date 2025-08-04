import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { StartSessionController } from "@interfaces/controller/Lawyer/Sessions/StartSessionController";

export function StartSessionComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new StartSessionController(usecase);
}
