import { AddPracticeAreaInputDto } from "@src/application/dtos/PracticeAreas/AddPracticeAreaDto";
import { IUseCase } from "../IUseCases/IUseCase";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";

export interface IAddPracticeAreasUsecase
  extends IUseCase<AddPracticeAreaInputDto, PracticeAreaDto> {}
