import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionsDocumentsController } from "@interfaces/controller/Client/Sessions/FetchSessionsDocumentsController";
import { FetchExistingSessionDocumentUseCase } from "@src/application/usecases/Client/implementations/FetchExistingSessionDocumentUseCase";
import { SessionDocumentsRepository } from "@infrastructure/database/repo/SessionsDocumentRepo";

export function FetchSessionDocumentsComposer(): IController {
    const usecase = new FetchExistingSessionDocumentUseCase(new SessionDocumentsRepository());
    return new FetchSessionsDocumentsController(usecase);
}
