import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionsController } from "@interfaces/controller/Lawyer/Sessions/FetchSessionsController";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { FetchSessionsUseCase } from "@src/application/usecases/Client/implementations/FetchSessionsUseCase";

export function FetchSessionsComposer(): IController {
    const usecase = new FetchSessionsUseCase(new SessionsRepository());
    return new FetchSessionsController(usecase);
}
