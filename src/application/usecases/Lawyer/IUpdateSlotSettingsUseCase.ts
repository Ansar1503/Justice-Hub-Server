import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IUseCase } from "../I_usecases/IUseCase";
import { UpdateSlotSettingsInputDto } from "@src/application/dtos/Lawyer/UpdateSlotSettingsDto";

export interface IUpdateSlotSettingsUseCase
  extends IUseCase<UpdateSlotSettingsInputDto, ScheduleSettings | null> {}
