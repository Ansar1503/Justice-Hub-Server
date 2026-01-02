"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseDocumentsByCaseComposer = FindCaseDocumentsByCaseComposer;
const CaseDocumentRepo_1 = require("@infrastructure/database/repo/CaseDocumentRepo");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseDocumentsMapper_1 = require("@infrastructure/Mapper/Implementations/CaseDocumentsMapper");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FindCaseDocumentsByCase_1 = require("@interfaces/controller/Cases/FindCaseDocumentsByCase");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindCaseDocumentsByCase_2 = require("@src/application/usecases/CaseDocuments/implementations/FindCaseDocumentsByCase");
function FindCaseDocumentsByCaseComposer() {
    const usecase = new FindCaseDocumentsByCase_2.FindCaseDocumentsByCaseUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()), new CaseDocumentRepo_1.CaseDocumentRepo(new CaseDocumentsMapper_1.caseDocumentsMapper()));
    return new FindCaseDocumentsByCase_1.FindCaseDocumentsByCaseController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
