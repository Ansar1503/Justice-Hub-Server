import { IController } from "@interfaces/controller/Interface/IController";
import { UploadSessionDocumentsController } from "@interfaces/controller/Client/Sessions/UploadSessionDocument";
import { UploadSessionDocument } from "@src/application/usecases/Client/implementations/UploadSessionDocumentUseCase";
import { SessionDocumentsRepository } from "@infrastructure/database/repo/SessionsDocumentRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";

export function UploadSessionDocumentsComposer(): IController {
  const usecase = new UploadSessionDocument(
    new SessionDocumentsRepository(),
    new SessionsRepository()
  );
  return new UploadSessionDocumentsController(usecase);
}
