import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchSlotSettingsUseCase
  extends IUseCase<string, ScheduleSettings | null> {}
