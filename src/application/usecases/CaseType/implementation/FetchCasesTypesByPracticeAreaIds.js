"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseTypesByPracticeAreas = void 0;
class FindCaseTypesByPracticeAreas {
    _caseTypeRepo;
    constructor(_caseTypeRepo) {
        this._caseTypeRepo = _caseTypeRepo;
    }
    async execute(input) {
        const caseTypes = await this._caseTypeRepo.findByPracticeAreas(input);
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
exports.FindCaseTypesByPracticeAreas = FindCaseTypesByPracticeAreas;
