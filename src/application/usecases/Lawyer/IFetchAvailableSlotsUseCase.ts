import { AvailabilityOutputDto } from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchAvailableSlotsUseCase
  extends IUseCase<string, AvailabilityOutputDto> {}
