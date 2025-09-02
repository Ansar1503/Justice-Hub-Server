import { AddSpecializationInputDto } from "@src/application/dtos/Specializations/AddSpecializationDto";
import { IUseCase } from "../IUseCases/IUseCase";
import { SpecializationDto } from "@src/application/dtos/Specializations/SpecializationDto";

export interface IAddSpecializationUsecase
  extends IUseCase<AddSpecializationInputDto, SpecializationDto> {}
