"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCaseDetailsComposer = updateCaseDetailsComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const UpdateCasesDetailsController_1 = require("@interfaces/controller/Cases/UpdateCasesDetailsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UpdateCaseDetailsUsecase_1 = require("@src/application/usecases/Case/Implimentations/UpdateCaseDetailsUsecase");
function updateCaseDetailsComposer() {
    const usecase = new UpdateCaseDetailsUsecase_1.UpdateCaseDetailsUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new UpdateCasesDetailsController_1.UpdateCaseDetailsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
