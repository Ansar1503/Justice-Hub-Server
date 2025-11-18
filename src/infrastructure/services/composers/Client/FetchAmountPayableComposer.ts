import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { FetchAmountPayableController } from "@interfaces/controller/Client/FetchAmountPayableController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchAmountPayableUsecase } from "@src/application/usecases/Client/implementations/FetchAmountPayableUsecase";

export function FetchAmountPayableComposer(): IController {
  const usecase = new FetchAmountPayableUsecase(
    new LawyerRepository(),
    new UserSubscriptionRepository(new UserSubscriptionMapper()),
    new CommissionSettingsRepo(new CommissionSettingsMapper())
  );
  return new FetchAmountPayableController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
