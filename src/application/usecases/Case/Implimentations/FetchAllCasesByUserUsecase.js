"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasesByUserUsecase = void 0;
class FetchAllCasesByUserUsecase {
    _caseRepo;
    constructor(_caseRepo) {
        this._caseRepo = _caseRepo;
    }
    async execute(input) {
        const cases = await this._caseRepo.findAllByUser(input);
        return cases.map((c) => ({
            caseType: c.caseType,
            clientId: c.clientId,
            createdAt: c.createdAt,
            id: c.id,
            lawyerId: c.lawyerId,
            status: c.status,
            title: c.title,
            updatedAt: c.updatedAt,
            estimatedValue: c.estimatedValue,
            nextHearing: c.nextHearing,
            summary: c.summary,
        }));
    }
}
exports.FetchAllCasesByUserUsecase = FetchAllCasesByUserUsecase;
