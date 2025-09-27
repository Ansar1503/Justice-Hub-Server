import { CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { ICasetype } from "@domain/IRepository/ICasetype";
import { IFindCaseTypesByPracticeAreas } from "../IFetchCasesTypesByPracticeAreaIds";

export class FindCaseTypesByPracticeAreas implements IFindCaseTypesByPracticeAreas {
    constructor(private _caseTypeRepo: ICasetype) {}
    async execute(input: string[]): Promise<CaseTypeDto[] | []> {
        const caseTypes = await this._caseTypeRepo.findByPracticeAreas(input);
        if (!caseTypes) return [];
        return caseTypes.map((c) => ({
            createdAt: c.createdAt,
            id: c.id,
            name: c.name,
            practiceareaId: c.practiceareaId,
            updatedAt: c.updatedAt,
        }));
    }
}
