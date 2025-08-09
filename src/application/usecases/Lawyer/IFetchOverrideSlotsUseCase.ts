import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchOverrideSlotsUseCase
  extends IUseCase<string, OverrideSlotsDto> {}
