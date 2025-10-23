import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { CancelSubscriptionController } from "@interfaces/controller/Subscription/CancelSubscriptoinController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { CancelSubscriptionUsecase } from "@src/application/usecases/Subscription/implementation/CancelSubscriptionUsecase";

export function CancelSubscriptionComposer(): IController {
  const usecase = new CancelSubscriptionUsecase(
    new UserSubscriptionRepository(new UserSubscriptionMapper()),
    new StripeSubscriptionService()
  );
  return new CancelSubscriptionController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
