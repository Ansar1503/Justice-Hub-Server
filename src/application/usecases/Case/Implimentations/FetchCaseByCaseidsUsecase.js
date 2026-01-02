"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseByCaseidsUsecase = void 0;
class FetchCaseByCaseidsUsecase {
    _caseRepo;
    constructor(_caseRepo) {
        this._caseRepo = _caseRepo;
    }
    async execute(input) {
        const data = await this._caseRepo.findByCaseTypes(input);
        if (data.length == 0) {
            throw new Error("no data found");
        }
        return data.map((d) => ({
            caseType: d.caseType,
            clientId: d.clientId,
            createdAt: d.createdAt,
            id: d.id,
            lawyerId: d.lawyerId,
            status: d.status,
            title: d.title,
            updatedAt: d.updatedAt,
            estimatedValue: d.estimatedValue,
            nextHearing: d.nextHearing,
            summary: d.summary,
        }));
    }
}
exports.FetchCaseByCaseidsUsecase = FetchCaseByCaseidsUsecase;
