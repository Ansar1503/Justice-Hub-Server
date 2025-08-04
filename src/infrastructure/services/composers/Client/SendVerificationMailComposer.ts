import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { SendVerificationMailController } from "@interfaces/controller/Client/SendVerificationMailController";

export function SendVerificationMailComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new SendVerificationMailController(usecase);
}
