import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import {
    FindAllPracticeAreaInputDto,
    FindAllPracticeAreaOutputDto,
} from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { IFindAllPracticeAreasUsecase } from "../IFindAllPracticeAreasUsecase";

export class FindAllpracticeAreasUsecase implements IFindAllPracticeAreasUsecase {
    constructor(private _practiceAreaRepo: IPracticAreaRepo) {}
    async execute(input: FindAllPracticeAreaInputDto): Promise<FindAllPracticeAreaOutputDto> {
        return await this._practiceAreaRepo.findAll(input);
    }
}
