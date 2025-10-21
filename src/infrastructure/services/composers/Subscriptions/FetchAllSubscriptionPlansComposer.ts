import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAllSubscriptionPlansController } from "@interfaces/controller/Subscription/FetchAllSubscriptionPlansController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchAllSubscriptionPlansUsecase } from "@src/application/usecases/Subscription/implementation/FetchAllSubscriptionPlansUsecase";

export function FetchAllSubscriptionPlansComposer(): IController {
  const usecase = new FetchAllSubscriptionPlansUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper())
  );
  return new FetchAllSubscriptionPlansController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
