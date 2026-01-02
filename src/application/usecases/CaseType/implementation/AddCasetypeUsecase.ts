import { ICasetype } from "@domain/IRepository/ICasetype";
import { AddCasetypeInputDto, CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { CaseType } from "../../../../domain/entities/CaseType";
import { IAddCasetypeUsecase } from "../IAddCasetypeUsecase";

export class AddCasetypeUsecase implements IAddCasetypeUsecase {
    constructor(
        private caseTypeRepo: ICasetype,
        private practiceAreaRepo: IPracticAreaRepo,
    ) {}
    async execute(input: AddCasetypeInputDto): Promise<CaseTypeDto> {
        const practiceExists = await this.practiceAreaRepo.findById(input.practiceareaId);
        if (!practiceExists) throw new Error("practice area doesnt exist");
        const nameExists = await this.caseTypeRepo.findByName(input.name);
        if (nameExists?.name === input.name) {
            throw new Error("name already exists");
        }
        const CaseTypePayload = CaseType.create({
            name: input.name,
            practiceareaId: input.practiceareaId,
        });
        const newCaseTypeCreated = await this.caseTypeRepo.create(CaseTypePayload);
        return {
            id: newCaseTypeCreated.id,
            name: newCaseTypeCreated.name,
            practiceareaId: newCaseTypeCreated.practiceareaId,
            createdAt: newCaseTypeCreated.createdAt,
            updatedAt: newCaseTypeCreated.updatedAt,
        };
    }
}
