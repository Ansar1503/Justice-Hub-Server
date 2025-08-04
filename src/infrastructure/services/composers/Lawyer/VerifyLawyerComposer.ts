import { IController } from "@interfaces/controller/Interface/IController";
import { LawyerUsecase } from "@src/application/usecases/lawyer.usecase";
import { lawyerUseCaseComposer } from "./LawyerUseCaseComposer";
import { VerifyLawyerController } from "@interfaces/controller/Lawyer/VerifyLawyerController";

export function VerifyLawyerComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new VerifyLawyerController(usecase);
}
