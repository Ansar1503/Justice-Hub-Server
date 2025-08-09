import { LawyerDocumentsRepository } from "@infrastructure/database/repo/LawyerDocuemtsRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { VerifyLawyerController } from "@interfaces/controller/Lawyer/VerifyLawyerController";
import { VerifyLawyerUseCase } from "@src/application/usecases/Lawyer/implementations/VerifyLawyerUseCase";

export function VerifyLawyerComposer(): IController {
  const userRepo = new UserRepository();
  const lawyerRepo = new LawyerRepository();
  const lawyerDocumentRepo = new LawyerDocumentsRepository();
  const usecase = new VerifyLawyerUseCase(
    userRepo,
    lawyerRepo,
    lawyerDocumentRepo
  );
  return new VerifyLawyerController(usecase);
}
