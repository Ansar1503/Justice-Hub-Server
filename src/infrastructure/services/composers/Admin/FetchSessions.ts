import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { FetchSessions } from "@interfaces/controller/Admin/FetchSessions";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionUseCase } from "@src/application/usecases/Admin/Implementations/FetchSessionUseCase";

export function fetchSessionsComposer(): IController {
    const repo = new SessionsRepository();
    const usecase = new FetchSessionUseCase(repo);
    const controller = new FetchSessions(usecase);
    return controller;
}
