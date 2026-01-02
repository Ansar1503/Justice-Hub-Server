"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasetypeComposer = UpdateCasetypeComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const UpdateCasetypeController_1 = require("@interfaces/controller/CaseType/UpdateCasetypeController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UpdateCasetypeUsecase_1 = require("@src/application/usecases/CaseType/implementation/UpdateCasetypeUsecase");
function UpdateCasetypeComposer() {
    const practiceAreaRepo = new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper());
    const casetypeRepo = new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper());
    const usecase = new UpdateCasetypeUsecase_1.UpdateCasetypeUsecase(casetypeRepo, practiceAreaRepo);
    return new UpdateCasetypeController_1.UpdateCasetypeController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
