import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IRemoveOverrideSlotUseCase
  extends IUseCase<{ lawyer_id: string; date: string }, OverrideSlotsDto> {}
