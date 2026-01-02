"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseDetailsUsecase = void 0;
class FindCaseDetailsUsecase {
    _caseRepo;
    constructor(_caseRepo) {
        this._caseRepo = _caseRepo;
    }
    async execute(input) {
        const caseDetails = await this._caseRepo.findById(input);
        if (!caseDetails)
            throw new Error("Case Details Not Found");
        return caseDetails;
    }
}
exports.FindCaseDetailsUsecase = FindCaseDetailsUsecase;
