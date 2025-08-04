import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { EndSessionController } from "@interfaces/controller/Lawyer/Sessions/EndSessionController";

export function EndSessionComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new EndSessionController(usecase);
}
