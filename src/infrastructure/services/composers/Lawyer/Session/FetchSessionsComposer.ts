import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionsController } from "@interfaces/controller/Lawyer/Sessions/FetchSessionsController";
import { FetchSessionsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchSessionsUseCase";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

export function FetchSessionsComposer(): IController {
  const usecase = new FetchSessionsUseCase(new SessionsRepository());
  return new FetchSessionsController(usecase);
}
