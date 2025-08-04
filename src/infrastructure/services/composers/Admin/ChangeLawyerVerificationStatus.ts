import { LawyerRepository } from "@infrastructure/database/repo/lawyer.repo";
import { UserRepository } from "@infrastructure/database/repo/user.repo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { ChangeLawyerVerificationStatusController } from "@interfaces/controller/Admin/ChangeLawyerVerification";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChangeLawyerVerificationStatus } from "@src/application/usecases/Admin/Implementations/ChangeLawyerVerificationUseCase";

export function ChangeLawyerVerificationComposer(): IController {
  const lawyerMapper = new LawyerMapper();
  const userMapper = new UserMapper();
  const lawyerRepo = new LawyerRepository(lawyerMapper);
  const userRepo = new UserRepository(userMapper);
  const useCase = new ChangeLawyerVerificationStatus(userRepo, lawyerRepo);
  const controller = new ChangeLawyerVerificationStatusController(useCase);
  return controller;
}
