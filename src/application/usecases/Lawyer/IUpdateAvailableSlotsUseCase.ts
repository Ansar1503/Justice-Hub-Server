import { AvailabilityInputDto, AvailabilityOutputDto } from "@src/application/dtos/Lawyer/AvailabilityDto";
import { IUseCase } from "../IUseCases/IUseCase";


export interface IUpdateAvailableSlotsUseCase
  extends IUseCase<AvailabilityInputDto, AvailabilityOutputDto> {}
