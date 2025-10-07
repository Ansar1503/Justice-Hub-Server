import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";
import { CreateOrUpdateCommissionSettingsController } from "@interfaces/controller/Commission/CreateOrUpdateCommissionSettingsController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { CreateOrUpdateCommissionSettingsUseCase } from "@src/application/usecases/Commission/Implementations/CreateOrUpdateCommissionSettingsUsecase";

export function CreateOrUpdateCommissionSettingsComposer(): IController {
  const usecase = new CreateOrUpdateCommissionSettingsUseCase(
    new CommissionSettingsRepo(new CommissionSettingsMapper())
  );
  return new CreateOrUpdateCommissionSettingsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
