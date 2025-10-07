import { CommissionSettingsDto } from "@src/application/dtos/Commission/CommissionSettingsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchCommissionSettingsUsecase
  extends IUseCase<null, CommissionSettingsDto> {}
