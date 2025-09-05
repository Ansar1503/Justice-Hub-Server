import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdatePracticeAreaUsecase
  extends IUseCase<
    { id: string; name: string; specId: string },
    PracticeAreaDto
  > {}
