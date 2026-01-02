"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseTypesByPracticeAreasComposer = FindCaseTypesByPracticeAreasComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const FindCaseTypeByPracticeAreaController_1 = require("@interfaces/controller/CaseType/FindCaseTypeByPracticeAreaController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCasesTypesByPracticeAreaIds_1 = require("@src/application/usecases/CaseType/implementation/FetchCasesTypesByPracticeAreaIds");
function FindCaseTypesByPracticeAreasComposer() {
    const usecase = new FetchCasesTypesByPracticeAreaIds_1.FindCaseTypesByPracticeAreas(new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper()));
    return new FindCaseTypeByPracticeAreaController_1.FindCaseTypesByPracticeAreasController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
