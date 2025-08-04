import { IController } from "@interfaces/controller/Interface/IController";
import { HandleWebhookController } from "@interfaces/controller/Client/StripeWebhookController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export function HandleWebhookComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new HandleWebhookController(usecase);
}
