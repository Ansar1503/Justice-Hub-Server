"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseDocumentsUseCase = void 0;
class DeleteCaseDocumentsUseCase {
    _caseDocumentsRepo;
    _cloudinaryService;
    constructor(_caseDocumentsRepo, _cloudinaryService) {
        this._caseDocumentsRepo = _caseDocumentsRepo;
        this._cloudinaryService = _cloudinaryService;
    }
    async execute(input) {
        const existingCaseDocuments = await this._caseDocumentsRepo.findById(input.documentId);
        if (!existingCaseDocuments)
            throw new Error("case documents not found");
        if (existingCaseDocuments.uploadedBy !== input.userId)
            throw new Error("Unable to delete others uploaded file");
        await this._caseDocumentsRepo.delete(input.documentId);
        await this._cloudinaryService.deleteFile(existingCaseDocuments.document.url);
    }
}
exports.DeleteCaseDocumentsUseCase = DeleteCaseDocumentsUseCase;
