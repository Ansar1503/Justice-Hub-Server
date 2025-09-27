import { SpecializationDto } from "@src/application/dtos/Specializations/SpecializationDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeleteSpecializationUsecase extends IUseCase<string, SpecializationDto> {}
