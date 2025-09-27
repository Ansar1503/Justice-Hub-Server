import { ScheduleSettingsOutputDto } from "@src/application/dtos/Lawyer/ScheduleSettingsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchSlotSettingsUseCase extends IUseCase<string, ScheduleSettingsOutputDto | null> {}
