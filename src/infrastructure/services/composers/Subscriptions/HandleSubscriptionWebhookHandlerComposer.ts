import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { HandleSubscribeWebhookController } from "@interfaces/controller/Subscription/HandleSubscriptionWebhookController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { SubscriptionWebhookHandlerUsecase } from "@src/application/usecases/Subscription/implementation/SubscriptionWebhookHandlerUsecase";

export function HandleSubscribeWebhookComposer(): IController {
  const usecase = new SubscriptionWebhookHandlerUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper()),
    new UserSubscriptionRepository(new UserSubscriptionMapper()),
    new StripeSubscriptionService()
  );
  return new HandleSubscribeWebhookController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
