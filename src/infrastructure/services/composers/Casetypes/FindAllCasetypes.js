"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCaseTypesComposer = FindAllCaseTypesComposer;
const CaseTypeRepo_1 = require("@infrastructure/database/repo/CaseTypeRepo");
const CaseTypeMapper_1 = require("@infrastructure/Mapper/Implementations/CaseTypeMapper");
const FindAllCasetypes_1 = require("@interfaces/controller/CaseType/FindAllCasetypes");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindAllCaseTypes_1 = require("@src/application/usecases/CaseType/implementation/FindAllCaseTypes");
function FindAllCaseTypesComposer() {
    const usecase = new FindAllCaseTypes_1.FindAllCaseTypesUseCase(new CaseTypeRepo_1.CaseTypeRepo(new CaseTypeMapper_1.CaseTypeMapper()));
    return new FindAllCasetypes_1.FindAllCaseTypes(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
