import { FetchClientDataController } from "@interfaces/controller/Client/FetchClientController";
import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export function FetchClientDataComposer(): IController {
  const usecase = ClientUseCaseComposer();
  const controller = new FetchClientDataController(usecase);
  return controller;
}
