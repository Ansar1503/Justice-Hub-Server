import { FetchCallLogsController } from "@interfaces/controller/Client/FetchCallLogsController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { IController } from "@interfaces/controller/Interface/IController";

export function FetchCallLogsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchCallLogsController(usecase);
}
