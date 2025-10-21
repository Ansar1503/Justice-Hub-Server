import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateSubscriptionPlanController } from "@interfaces/controller/Subscription/UpdateSubscriptionPlanController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { StripeSubscriptionService } from "@src/application/services/StripeSubscriptionService";
import { UpdateSubscriptionPlanUsecase } from "@src/application/usecases/Subscription/implementation/UpdateSubscriptionPlanUsecase";

export function UpdateSubscriptionPlanComposer(): IController {
  const usecase = new UpdateSubscriptionPlanUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper()),
    new StripeSubscriptionService()
  );
  return new UpdateSubscriptionPlanController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
