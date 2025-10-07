import {
  CommissionSettingsDto,
  CreateOrUpdateCommissionSettingsInputDto,
} from "@src/application/dtos/Commission/CommissionSettingsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface ICreateOrUpdateCommissionSettingsUsecase
  extends IUseCase<
    CreateOrUpdateCommissionSettingsInputDto,
    CommissionSettingsDto
  > {}
