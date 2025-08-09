import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionController } from "@interfaces/controller/Client/Sessions/FetchSessionsController";
import { FetchSessionsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchSessionsUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

export function FetchSessionsComposer(): IController {
  const usecase = new FetchSessionsUseCase(new SessionsRepository());
  return new FetchSessionController(usecase);
}
