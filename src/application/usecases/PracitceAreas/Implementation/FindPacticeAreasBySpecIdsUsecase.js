"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPracticeAreasBySpecIdsUsecase = void 0;
class FindPracticeAreasBySpecIdsUsecase {
    PracticeAreaRepo;
    constructor(PracticeAreaRepo) {
        this.PracticeAreaRepo = PracticeAreaRepo;
    }
    async execute(input) {
        const practiceArea = await this.PracticeAreaRepo.findBySpecIds(input.specIds);
        if (!practiceArea)
            return [];
        return practiceArea.map((p) => ({
            createdAt: p.createdAt,
            id: p.id,
            name: p.name,
            specializationId: p.specializationId,
            updatedAt: p.udpatedAt,
        }));
    }
}
exports.FindPracticeAreasBySpecIdsUsecase = FindPracticeAreasBySpecIdsUsecase;
