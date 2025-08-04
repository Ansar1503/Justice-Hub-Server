import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { UploadSessionDocumentsController } from "@interfaces/controller/Client/UploadSessionDocument";

export function UploadSessionDocumentsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UploadSessionDocumentsController(usecase);
}
