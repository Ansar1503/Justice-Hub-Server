import { AvailabilityInputDto, AvailabilityOutputDto } from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IUseCase } from "../I_usecases/IUseCase";


export interface IUpdateAvailableSlotsUseCase
  extends IUseCase<AvailabilityInputDto, AvailabilityOutputDto> {}
