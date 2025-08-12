import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IRemoveOverrideSlotUseCase
  extends IUseCase<{ lawyer_id: string; date: string }, OverrideSlotsDto> {}
