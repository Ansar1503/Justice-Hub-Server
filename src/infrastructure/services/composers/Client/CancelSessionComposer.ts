import { CancelSessionController } from "@interfaces/controller/Client/CancelSessionController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { IController } from "@interfaces/controller/Interface/IController";

export function CancelSessionComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new CancelSessionController(usecase);
}
