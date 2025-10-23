import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchCurrentUserSubscriptionController } from "@interfaces/controller/Subscription/FetchCurrentUserSubscriptionController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchCurrentUserSubscriptionUsecase } from "@src/application/usecases/Subscription/implementation/FetchCurrentUserSubscriptionUsecase";

export function FetchCurrentUserSubscriptionComposer(): IController {
  const usecase = new FetchCurrentUserSubscriptionUsecase(
    new UserSubscriptionRepository(new UserSubscriptionMapper())
  );
  return new FetchCurrentUserSubscriptionController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
