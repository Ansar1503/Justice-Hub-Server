"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCasetypeComposer = FindAllCasetypeComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const FetchAllCasetypeController_1 = require("@interfaces/controller/CaseType/FetchAllCasetypeController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCasetypeUsecase_1 = require("@src/application/usecases/CaseType/implementation/FetchCasetypeUsecase");
function FindAllCasetypeComposer() {
    const casetypeRepo = new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper());
    const usecase = new FetchCasetypeUsecase_1.FetchCasetypeUsecase(casetypeRepo);
    return new FetchAllCasetypeController_1.FetchAllCasetypeController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
