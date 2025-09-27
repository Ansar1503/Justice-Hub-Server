import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { AggregatedCasesData } from "@src/application/dtos/Cases/FindCasesByQueryDto";
import { IFindCaseDetailsUsecase } from "../Interfaces/IFindCaseDetailsUsecase";

export class FindCaseDetailsUsecase implements IFindCaseDetailsUsecase {
    constructor(private _caseRepo: ICaseRepo) {}
    async execute(input: string): Promise<AggregatedCasesData> {
        const caseDetails = await this._caseRepo.findById(input);
        if (!caseDetails) throw new Error("Case Details Not Found");
        return caseDetails;
    }
}
