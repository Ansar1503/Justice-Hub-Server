"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCaseDetailsUsecase = void 0;
class UpdateCaseDetailsUsecase {
    _casesRepo;
    constructor(_casesRepo) {
        this._casesRepo = _casesRepo;
    }
    async execute(input) {
        const existsCase = await this._casesRepo.findById(input.caseId);
        if (!existsCase) {
            throw new Error("Case not found");
        }
        const updatedCase = await this._casesRepo.update(input.caseId, {
            id: input.caseId,
            title: input.title,
            summary: input.summary,
            estimatedValue: input.estimatedValue,
            nextHearing: input.nextHearing ? new Date(input.nextHearing) : undefined,
            status: input.status,
        });
        if (!updatedCase) {
            throw new Error("case update failed");
        }
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
        };
    }
}
exports.UpdateCaseDetailsUsecase = UpdateCaseDetailsUsecase;
