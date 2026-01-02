"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCaseDocumentComposer = DeleteCaseDocumentComposer;
const CaseDocumentRepo_1 = require("@infrastructure/database/repo/CaseDocumentRepo");
const CaseDocumentsMapper_1 = require("@infrastructure/Mapper/Implementations/CaseDocumentsMapper");
const DeleteCaseDocumentController_1 = require("@interfaces/controller/Cases/DeleteCaseDocumentController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const cloudinary_service_1 = require("@src/application/services/cloudinary.service");
const DeleteCaseDocument_1 = require("@src/application/usecases/CaseDocuments/implementations/DeleteCaseDocument");
function DeleteCaseDocumentComposer() {
    const usecase = new DeleteCaseDocument_1.DeleteCaseDocumentsUseCase(new CaseDocumentRepo_1.CaseDocumentRepo(new CaseDocumentsMapper_1.caseDocumentsMapper()), new cloudinary_service_1.CloudinaryService());
    return new DeleteCaseDocumentController_1.DeleteCaseDocumentsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
