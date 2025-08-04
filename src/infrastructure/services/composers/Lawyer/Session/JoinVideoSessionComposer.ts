import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { JoinVideoSessionController } from "@interfaces/controller/Lawyer/Sessions/JoinVideoController";

export function JoinVideoSessionComposer(): IController {
  const usecase = lawyerUseCaseComposer();
  return new JoinVideoSessionController(usecase);
}
