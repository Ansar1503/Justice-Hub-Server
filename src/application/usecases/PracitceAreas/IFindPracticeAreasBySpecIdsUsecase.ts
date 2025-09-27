import { findPracticeAreasBySpecIdsInputDto } from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFindPracticeareasByspecIdsUsecase
    extends IUseCase<findPracticeAreasBySpecIdsInputDto, PracticeAreaDto[] | []> {}
