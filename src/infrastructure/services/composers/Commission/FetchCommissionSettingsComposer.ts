import { CommissionSettingsRepo } from "@infrastructure/database/repo/CommissionSettingsRepo";
import { CommissionSettingsMapper } from "@infrastructure/Mapper/Implementations/CommissionSettingsMapper";
import { FetchCommissionSettingsController } from "@interfaces/controller/Commission/FetchCommissionSettingsController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchCommissionSettingsUsecase } from "@src/application/usecases/Commission/Implementations/FetchCommmissionSettingsUsecase";

export function FetchCommissionSettingsComposer(): IController {
  const usecase = new FetchCommissionSettingsUsecase(
    new CommissionSettingsRepo(new CommissionSettingsMapper())
  );
  return new FetchCommissionSettingsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
