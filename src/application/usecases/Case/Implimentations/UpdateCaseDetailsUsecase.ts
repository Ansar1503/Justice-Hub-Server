import { UpdateCaseDto, CaseDto } from "@src/application/dtos/Cases/CasesDto";
import { IUpdateCasesDetailsUsecase } from "../Interfaces/IUpdateCasesDetailsUsecase";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";

export class UpdateCaseDetailsUsecase implements IUpdateCasesDetailsUsecase {
    constructor(private _casesRepo: ICaseRepo) { }
    async execute(input: UpdateCaseDto): Promise<CaseDto> {
        const existsCase = await this._casesRepo.findById(input.caseId);
        if (!existsCase) {
            throw new Error("Case not found");
        }
        console.log("input", input)
        const updatedCase = await this._casesRepo.update(input.caseId, {
            id: input.caseId,
            title: input.title,
            summary: input.summary,
            estimatedValue: input.estimatedValue,
            nextHearing: input.nextHearing ? new Date(input.nextHearing) : undefined,
            status: input.status,
        },);
        if (!updatedCase) {
            throw new Error("case update failed")
        }
        console.log("updatedCase", updatedCase)
        return {
            caseType: updatedCase.caseType,
            clientId: updatedCase.clientId,
            createdAt: updatedCase.createdAt,
            id: updatedCase.id,
            lawyerId: updatedCase.lawyerId,
            status: updatedCase.status,
            title: updatedCase.title,
            updatedAt: updatedCase.updatedAt,
            estimatedValue: updatedCase.estimatedValue,
            nextHearing: updatedCase.nextHearing,
            summary: updatedCase.summary
        }
    }
}