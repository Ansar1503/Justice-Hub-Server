import { IController } from "@interfaces/controller/Interface/IController";
import { FetchStripeSessionDetailsController } from "@interfaces/controller/Client/FetchStripeSessionDetails";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export function FetchStripeSessionDetailsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchStripeSessionDetailsController(usecase);
}
