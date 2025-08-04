import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { FetchSessionsController } from "@interfaces/controller/Lawyer/Sessions/FetchSessionsController";

export function FetchSessionsComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new FetchSessionsController(usecase);
}
