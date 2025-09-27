import {
    FindAllPracticeAreaInputDto,
    FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFindAllPracticeAreasUsecase
    extends IUseCase<FindAllPracticeAreaInputDto, FindAllPracticeAreaOutputDto> {}
