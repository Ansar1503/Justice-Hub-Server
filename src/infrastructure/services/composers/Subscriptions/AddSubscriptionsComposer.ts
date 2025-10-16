import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { AddSubscriptionPlanController } from "@interfaces/controller/Subscription/AddSubscriptionPlanController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AddSubscriptionPlanUsecase } from "@src/application/usecases/Subscription/implementation/AddSubscriptionPlanUsecase";

export function AddSubscriptionPlanComposer(): IController {
  const usecase = new AddSubscriptionPlanUsecase(
    new SubscriptionRepository(new SubscriptionPlanMapper())
  );
  return new AddSubscriptionPlanController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
