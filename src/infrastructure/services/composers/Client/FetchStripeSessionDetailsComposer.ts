import { IController } from "@interfaces/controller/Interface/IController";
import { FetchStripeSessionDetailsController } from "@interfaces/controller/Client/FetchStripeSessionDetails";
import { FetchStripeSessionDetailsUseCase } from "@src/application/usecases/Client/implementations/FethStripeSessionDetailsUseCase";

export function FetchStripeSessionDetailsComposer(): IController {
    const usecase = new FetchStripeSessionDetailsUseCase();
    return new FetchStripeSessionDetailsController(usecase);
}
