import { IController } from "@interfaces/controller/Interface/IController";
import { JoinVideoSessionController } from "@interfaces/controller/Lawyer/Sessions/JoinVideoController";
import { JoinSessionUseCase } from "@src/application/usecases/Lawyer/implementations/JoinSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";

export function JoinVideoSessionComposer(): IController {
  const usecase = new JoinSessionUseCase(
    new SessionsRepository(),
    new AppointmentsRepository(),
    new UserRepository()
  );
  return new JoinVideoSessionController(usecase);
}
