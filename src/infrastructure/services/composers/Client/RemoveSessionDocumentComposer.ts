import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { RemoveSessionDocumentController } from "@interfaces/controller/Client/RemoveSessionDocument";

export function RemoveSessionDocumentComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new RemoveSessionDocumentController(usecase);
}
