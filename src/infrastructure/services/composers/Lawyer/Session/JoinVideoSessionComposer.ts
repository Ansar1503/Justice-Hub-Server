import { IController } from "@interfaces/controller/Interface/IController";
import { JoinVideoSessionController } from "@interfaces/controller/Lawyer/Sessions/JoinVideoController";
import { JoinSessionUseCase } from "@src/application/usecases/Lawyer/implementations/JoinSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

export function JoinVideoSessionComposer(): IController {
  const usecase = new JoinSessionUseCase(new SessionsRepository());
  return new JoinVideoSessionController(usecase);
}
