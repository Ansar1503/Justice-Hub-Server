import { IController } from "@interfaces/controller/Interface/IController";
import { RemoveFailedSessionController } from "@interfaces/controller/Client/RemoveFailedSessionController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export function RemoveFailedSessionComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new RemoveFailedSessionController(usecase);
}
