import { EndSessionController } from "@interfaces/controller/Client/EndSessionController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { IController } from "@interfaces/controller/Interface/IController";

export function EndSessionComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new EndSessionController(usecase);
}
