import { ICasetype } from "@domain/IRepository/ICasetype";
import { IFechAllCasetypeUsecase } from "../IFetchAllCasetypeUsecase";
import {
  CasetypeFetchQueryDto,
  CaseTypeFetchResultDto,
} from "@src/application/dtos/CaseType/CaseTypeDto";

export class FetchCasetypeUsecase implements IFechAllCasetypeUsecase {
  constructor(private casetypeRepo: ICasetype) {}
  async execute(input: CasetypeFetchQueryDto): Promise<CaseTypeFetchResultDto> {
    return await this.casetypeRepo.findAllByQuery(input);
  }
}
