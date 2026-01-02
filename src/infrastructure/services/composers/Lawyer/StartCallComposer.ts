import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { StartCallController } from "@interfaces/controller/Lawyer/StartCallController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StartCallUsecase } from "@src/application/usecases/Lawyer/implementations/StartCallUsecase";

export function StartCallComposer(): IController {
  const usecase = new StartCallUsecase(
    new SessionsRepository(),
    new CallLogsRepository(),
    new UserRepository()
  );
  return new StartCallController(usecase, new HttpErrors(), new HttpSuccess());
}
