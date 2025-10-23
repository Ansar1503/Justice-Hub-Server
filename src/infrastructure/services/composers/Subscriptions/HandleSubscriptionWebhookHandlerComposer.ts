import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { MongoUnitofWork } from "@infrastructure/database/UnitofWork/implementations/UnitofWork";
import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { HandleSubscribeWebhookController } from "@interfaces/controller/Subscription/HandleSubscriptionWebhookController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { SubscriptionWebhookHandlerUsecase } from "@src/application/usecases/Subscription/implementation/SubscriptionWebhookHandlerUsecase";

export function HandleSubscribeWebhookComposer(): IController {
  const usecase = new SubscriptionWebhookHandlerUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper()),
    new StripeSubscriptionService(),
    new MongoUnitofWork()
  );
  return new HandleSubscribeWebhookController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
