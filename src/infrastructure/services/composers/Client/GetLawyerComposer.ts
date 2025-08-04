import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { GetLawyersController } from "@interfaces/controller/Client/GetLawyersController";

export function GetLawyersComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new GetLawyersController(usecase);
}
