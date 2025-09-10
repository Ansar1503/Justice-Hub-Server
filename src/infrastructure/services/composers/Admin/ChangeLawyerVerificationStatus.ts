import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { ChangeLawyerVerificationStatusController } from "@interfaces/controller/Admin/ChangeLawyerVerification";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChangeLawyerVerificationStatus } from "@src/application/usecases/Admin/Implementations/ChangeLawyerVerificationUseCase";

export function ChangeLawyerVerificationComposer(): IController {
  const lawyerMapper = new LawyerVerificationMapper();
  const userMapper = new UserMapper();
  const lawyerRepo = new LawyerVerificationRepo(lawyerMapper);
  const userRepo = new UserRepository(userMapper);
  const useCase = new ChangeLawyerVerificationStatus(userRepo, lawyerRepo);
  const controller = new ChangeLawyerVerificationStatusController(useCase);
  return controller;
}
