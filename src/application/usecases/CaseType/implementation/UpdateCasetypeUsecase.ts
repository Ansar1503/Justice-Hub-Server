import { UpdateCasetypeInputDto, CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { ICasetype } from "@domain/IRepository/ICasetype";
import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IUpdateCaseTypeUsecase } from "../IUpdatedCaseTypeUsecase";

export class UpdateCasetypeUsecase implements IUpdateCaseTypeUsecase {
    constructor(
        private caseTypeRepo: ICasetype,
        private practiceAreaRepo: IPracticAreaRepo,
    ) {}
    async execute(input: UpdateCasetypeInputDto): Promise<CaseTypeDto> {
        const existsCasetype = await this.caseTypeRepo.findById(input.id);
        if (!existsCasetype) throw new Error("no case type exists");
        const existsPracticeArea = await this.practiceAreaRepo.findById(input.practiceareaId);
        if (!existsPracticeArea) throw new Error("practice area not found");
        existsCasetype.updateName(input.name);
        existsCasetype.updatePracticeareaId(input.practiceareaId);
        const existsName = await this.caseTypeRepo.findByName(input.name);
        if (existsName && existsName.id !== input.id) {
            throw new Error("another case type exists with the name " + input.name);
        }
        const updatedCasetype = await this.caseTypeRepo.update({
            id: input.id,
            name: input.name,
            practiceareaId: input.practiceareaId,
        });
        if (!updatedCasetype) throw new Error("case type update failed");
        return {
            id: updatedCasetype.id,
            name: updatedCasetype.name,
            practiceareaId: updatedCasetype.practiceareaId,
            createdAt: updatedCasetype.createdAt,
            updatedAt: updatedCasetype.updatedAt,
        };
    }
}
