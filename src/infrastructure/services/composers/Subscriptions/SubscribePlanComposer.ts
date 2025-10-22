import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { SubscribePlanController } from "@interfaces/controller/Subscription/SubscribePlanController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { SubscribePlanUsecase } from "@src/application/usecases/Subscription/implementation/SubscribePlanUsecase";

export function SubscribePlanComposer(): IController {
  const usecase = new SubscribePlanUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper()),
    new UserSubscriptionRepository(new UserSubscriptionMapper()),
    new StripeSubscriptionService(),
    new UserRepository()
  );
  return new SubscribePlanController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
