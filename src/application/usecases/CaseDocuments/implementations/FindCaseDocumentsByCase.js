"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseDocumentsByCaseUsecase = void 0;
class FindCaseDocumentsByCaseUsecase {
    _caseRepo;
    _caseDocumentRepo;
    constructor(_caseRepo, _caseDocumentRepo) {
        this._caseRepo = _caseRepo;
        this._caseDocumentRepo = _caseDocumentRepo;
    }
    async execute(input) {
        const caseExists = await this._caseRepo.findById(input.caseId);
        if (!caseExists)
            throw new Error("no case has been found");
        const data = await this._caseDocumentRepo.findByCase(input);
        return data;
    }
}
exports.FindCaseDocumentsByCaseUsecase = FindCaseDocumentsByCaseUsecase;
