"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCaseTypeComposer = AddCaseTypeComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const AddCaseTypeController_1 = require("@interfaces/controller/CaseType/AddCaseTypeController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const AddCasetypeUsecase_1 = require("@src/application/usecases/CaseType/implementation/AddCasetypeUsecase");
function AddCaseTypeComposer() {
    const caseTypeRepo = new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper());
    const practiceAreaRepo = new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper());
    const usecase = new AddCasetypeUsecase_1.AddCasetypeUsecase(caseTypeRepo, practiceAreaRepo);
    return new AddCaseTypeController_1.AddCasetypeController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
