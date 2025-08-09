import { IController } from "@interfaces/controller/Interface/IController";
import { FetchLawyerController } from "@interfaces/controller/Lawyer/FetchLawyerController";
import { FetchLawyerDataUseCase } from "@src/application/usecases/Lawyer/implementations/FetchLawyerDataUseCase";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerDocumentsRepository } from "@infrastructure/database/repo/LawyerDocuemtsRepo";

export function FetchLawyerComposer(): IController {
  const userRepo = new UserRepository();
  const lawyerRepo = new LawyerRepository();
  const lawyerDocsRepo = new LawyerDocumentsRepository();
  const usecase = new FetchLawyerDataUseCase(
    userRepo,
    lawyerRepo,
    lawyerDocsRepo
  );
  return new FetchLawyerController(usecase);
}
