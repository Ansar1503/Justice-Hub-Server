import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { UpdatePasswordController } from "@interfaces/controller/Client/UpdatePassword";

export function UpdatePasswordComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UpdatePasswordController(usecase);
}
