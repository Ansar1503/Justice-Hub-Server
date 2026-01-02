import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { EndCallController } from "@interfaces/controller/Lawyer/EndCallController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { EndCallUsecase } from "@src/application/usecases/Lawyer/implementations/EndCallUsecase";

export function EndCallComposer(): IController {
  const usecase = new EndCallUsecase(
    new UserRepository(),
    new SessionsRepository(),
    new CallLogsRepository()
  );
  return new EndCallController(usecase, new HttpErrors(), new HttpSuccess());
}
