import { IUseCase } from "../I_usecases/IUseCase";
import { ScheduleSettingsOutputDto } from "@src/application/dtos/Lawyer/ScheduleSettingsDto";

export interface IFetchSlotSettingsUseCase
  extends IUseCase<string, ScheduleSettingsOutputDto | null> {}
