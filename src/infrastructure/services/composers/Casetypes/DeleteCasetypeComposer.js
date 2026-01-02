"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCasetypeComposer = DeleteCasetypeComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const DeleteCasetypeController_1 = require("@interfaces/controller/CaseType/DeleteCasetypeController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const DeleteCasetypeUsecase_1 = require("@src/application/usecases/CaseType/implementation/DeleteCasetypeUsecase");
function DeleteCasetypeComposer() {
    const casetypeRepo = new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper());
    const usecase = new DeleteCasetypeUsecase_1.DeleteCasetypeUsecase(casetypeRepo);
    return new DeleteCasetypeController_1.DeleteCaseTypeController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
