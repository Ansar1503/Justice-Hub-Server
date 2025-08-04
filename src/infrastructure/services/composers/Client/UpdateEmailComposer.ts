import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { UpdateEmailController } from "@interfaces/controller/Client/UpdateMailController";

export function UpdateEmailComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UpdateEmailController(usecase);
}
