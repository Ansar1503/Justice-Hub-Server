"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCasetypeUsecase = void 0;
const CaseType_1 = require("@domain/entities/CaseType");
class AddCasetypeUsecase {
    caseTypeRepo;
    practiceAreaRepo;
    constructor(caseTypeRepo, practiceAreaRepo) {
        this.caseTypeRepo = caseTypeRepo;
        this.practiceAreaRepo = practiceAreaRepo;
    }
    async execute(input) {
        const practiceExists = await this.practiceAreaRepo.findById(input.practiceareaId);
        if (!practiceExists)
            throw new Error("practice area doesnt exist");
        const nameExists = await this.caseTypeRepo.findByName(input.name);
        if (nameExists?.name === input.name) {
            throw new Error("name already exists");
        }
        const CaseTypePayload = CaseType_1.CaseType.create({
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
exports.AddCasetypeUsecase = AddCasetypeUsecase;
