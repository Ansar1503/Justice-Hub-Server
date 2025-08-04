import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { FetchSessionController } from "@interfaces/controller/Client/FetchSessionsController";

export function FetchSessionsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchSessionController(usecase);
}
