"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCaseDocumentsUsecase = void 0;
const CaseDocument_1 = require("@domain/entities/CaseDocument");
class UploadCaseDocumentsUsecase {
    _caseRepo;
    _caseDocumentRepo;
    constructor(_caseRepo, _caseDocumentRepo) {
        this._caseRepo = _caseRepo;
        this._caseDocumentRepo = _caseDocumentRepo;
    }
    async execute(input) {
        const ExistingCase = await this._caseRepo.findById(input.caseId);
        if (!ExistingCase) {
            throw new Error("Existing Case not found");
        }
        const casepayload = CaseDocument_1.CaseDocument.create({
            caseId: input.caseId,
            document: input.document,
            uploadedBy: input.uploadedBy,
        });
        const caseDocument = await this._caseDocumentRepo.create(casepayload);
        return {
            caseId: caseDocument.caseId,
            createdAt: caseDocument.createdAt,
            document: {
                name: caseDocument.document.name,
                type: caseDocument.document.type,
                url: caseDocument.document.url,
                size: caseDocument.document.size,
            },
            id: caseDocument.id,
            updatedAt: caseDocument.updatedAt,
            uploadedBy: caseDocument.uploadedBy,
        };
    }
}
exports.UploadCaseDocumentsUsecase = UploadCaseDocumentsUsecase;
