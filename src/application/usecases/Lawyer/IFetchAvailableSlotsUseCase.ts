import { AvailabilityOutputDto } from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchAvailableSlotsUseCase
  extends IUseCase<string, AvailabilityOutputDto> {}
