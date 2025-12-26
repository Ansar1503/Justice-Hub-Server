import { ICasetype } from "@domain/IRepository/ICasetype";
import { CasetypeFetchQueryDto, CaseTypeFetchResultDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IFechAllCasetypeUsecase } from "../IFetchAllCasetypeUsecase";

export class FetchCasetypeUsecase implements IFechAllCasetypeUsecase {
    constructor(private _casetypeRepo: ICasetype) {}
    async execute(input: CasetypeFetchQueryDto): Promise<CaseTypeFetchResultDto> {
        return await this._casetypeRepo.findAllByQuery(input);
    }
}
