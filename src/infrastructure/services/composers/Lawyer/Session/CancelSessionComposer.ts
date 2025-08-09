import { IController } from "@interfaces/controller/Interface/IController";
import { CancelSessionController } from "@interfaces/controller/Lawyer/Sessions/CancelSessionController";
import { CancelSessionUseCase } from "@src/application/usecases/Lawyer/implementations/CancelSessionUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

export function CancelSessionComposer(): IController {
  const usecase = new CancelSessionUseCase(new SessionsRepository());
  return new CancelSessionController(usecase);
}
