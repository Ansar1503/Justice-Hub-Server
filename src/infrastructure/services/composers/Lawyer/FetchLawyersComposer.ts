import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "./LawyerUseCaseComposer";
import { FetchLawyerController } from "@interfaces/controller/Lawyer/FetchLawyerController";

export function FetchLawyerComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchLawyerController(usecase);
}
