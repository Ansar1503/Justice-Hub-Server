"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCaseTypesUseCase = void 0;
class FindAllCaseTypesUseCase {
    _caseTypeRepo;
    constructor(_caseTypeRepo) {
        this._caseTypeRepo = _caseTypeRepo;
    }
    async execute() {
        const caseTypes = await this._caseTypeRepo.findAll();
        if (!caseTypes)
            return [];
        return caseTypes.map((c) => ({
            createdAt: c.createdAt,
            id: c.id,
            name: c.name,
            practiceareaId: c.practiceareaId,
            updatedAt: c.updatedAt,
        }));
    }
}
exports.FindAllCaseTypesUseCase = FindAllCaseTypesUseCase;
