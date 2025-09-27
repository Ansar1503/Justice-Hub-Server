import { AddPracticeAreaInputDto } from "@src/application/dtos/PracticeAreas/AddPracticeAreaDto";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IAddPracticeAreasUsecase extends IUseCase<AddPracticeAreaInputDto, PracticeAreaDto> {}
