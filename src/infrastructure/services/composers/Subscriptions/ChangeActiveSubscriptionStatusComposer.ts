import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { ChangeActiveSubscriptionStatusController } from "@interfaces/controller/Subscription/ChangeActiveSubscriptionStatusController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { ChangeActiveSubscriptionStatusUsecase } from "@src/application/usecases/Subscription/implementation/DeactiveSubscriptionUsecase";

export function ChangeActiveSubscriptionStatusComposer(): IController {
  const usecase = new ChangeActiveSubscriptionStatusUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper()),
    new StripeSubscriptionService()
  );
  return new ChangeActiveSubscriptionStatusController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
