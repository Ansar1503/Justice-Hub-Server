import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IAddOverrideSlotsUseCase
  extends IUseCase<OverrideSlotsDto, OverrideSlotsDto> {}
