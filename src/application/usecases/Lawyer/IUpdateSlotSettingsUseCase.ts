import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { UpdateSlotSettingsInputDto } from "@src/application/dtos/Lawyer/UpdateSlotSettingsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateSlotSettingsUseCase extends IUseCase<UpdateSlotSettingsInputDto, ScheduleSettings | null> {}
