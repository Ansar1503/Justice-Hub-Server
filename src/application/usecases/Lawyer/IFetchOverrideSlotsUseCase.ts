import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchOverrideSlotsUseCase
  extends IUseCase<string, OverrideSlotsDto | null> {}
