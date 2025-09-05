import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IFindAllPracticeAreasUsecase } from "../IFindAllPracticeAreasUsecase";
import {
  FindAllPracticeAreaInputDto,
  FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";

export class FindAllpracticeAreasUsecase
  implements IFindAllPracticeAreasUsecase
{
  constructor(private practiceAreaRepo: IPracticAreaRepo) {}
  async execute(
    input: FindAllPracticeAreaInputDto
  ): Promise<FindAllPracticeAreaOutputDto> {
    return await this.practiceAreaRepo.findAll(input);
  }
}