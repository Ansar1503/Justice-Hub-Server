import { IUseCase } from "../IUseCases/IUseCase";
import { ScheduleSettingsOutputDto } from "@src/application/dtos/Lawyer/ScheduleSettingsDto";

export interface IFetchSlotSettingsUseCase
  extends IUseCase<string, ScheduleSettingsOutputDto | null> {}
