import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IDeletePracticeAreaUsecase extends IUseCase<string, PracticeAreaDto> {}
