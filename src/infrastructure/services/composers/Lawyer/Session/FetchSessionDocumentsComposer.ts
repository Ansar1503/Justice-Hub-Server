import { IController } from "@interfaces/controller/Interface/IController";
import { FetchSessionsDocumentsController } from "@interfaces/controller/Lawyer/Sessions/FetchSessionDocuments";
import { FetchSessionsDocumentsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchSessionDocumentsUseCase";
import { SessionDocumentsRepository } from "@infrastructure/database/repo/SessionsDocumentRepo";

export function FetchSessionDocumentsComposer(): IController {
  const usecase = new FetchSessionsDocumentsUseCase(
    new SessionDocumentsRepository()
  );
  return new FetchSessionsDocumentsController(usecase);
}
