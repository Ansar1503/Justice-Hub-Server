"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCaseDocumentsComposer = UploadCaseDocumentsComposer;
const CaseDocumentRepo_1 = require("@infrastructure/database/repo/CaseDocumentRepo");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseDocumentsMapper_1 = require("@infrastructure/Mapper/Implementations/CaseDocumentsMapper");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const UploadCaseDocumentsController_1 = require("@interfaces/controller/Cases/UploadCaseDocumentsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UploadCaseDocumentsUsecase_1 = require("@src/application/usecases/CaseDocuments/implementations/UploadCaseDocumentsUsecase");
function UploadCaseDocumentsComposer() {
    const usecase = new UploadCaseDocumentsUsecase_1.UploadCaseDocumentsUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()), new CaseDocumentRepo_1.CaseDocumentRepo(new CaseDocumentsMapper_1.caseDocumentsMapper()));
    return new UploadCaseDocumentsController_1.UploadCaseDocumentsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
