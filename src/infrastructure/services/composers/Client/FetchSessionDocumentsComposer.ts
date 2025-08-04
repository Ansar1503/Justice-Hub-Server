import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { FetchSessionsDocumentsController } from "@interfaces/controller/Client/FetchSessionsDocumentsController";

export function FetchSessionDocumentsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchSessionsDocumentsController(usecase);
}
