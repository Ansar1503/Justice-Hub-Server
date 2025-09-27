import { AddSpecializationInputDto } from "@src/application/dtos/Specializations/AddSpecializationDto";
import { SpecializationDto } from "@src/application/dtos/Specializations/SpecializationDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddSpecializationUsecase extends IUseCase<AddSpecializationInputDto, SpecializationDto> {}
