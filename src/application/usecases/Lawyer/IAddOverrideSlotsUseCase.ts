import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddOverrideSlotsUseCase extends IUseCase<OverrideSlotsDto, OverrideSlotsDto> {}
