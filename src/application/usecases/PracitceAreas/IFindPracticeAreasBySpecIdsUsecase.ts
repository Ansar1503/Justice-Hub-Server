import { findPracticeAreasBySpecIdsInputDto } from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { IUseCase } from "../IUseCases/IUseCase";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";

export interface IFindPracticeareasByspecIdsUsecase
  extends IUseCase<
    findPracticeAreasBySpecIdsInputDto,
    PracticeAreaDto[] | []
  > {}
