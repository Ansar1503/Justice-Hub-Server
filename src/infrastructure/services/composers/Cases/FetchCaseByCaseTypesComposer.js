"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseByCaseTypesComposer = FetchCaseByCaseTypesComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FetchCasesByCaseTypesIdsController_1 = require("@interfaces/controller/Cases/FetchCasesByCaseTypesIdsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCaseByCaseidsUsecase_1 = require("@src/application/usecases/Case/Implimentations/FetchCaseByCaseidsUsecase");
function FetchCaseByCaseTypesComposer() {
    const usecase = new FetchCaseByCaseidsUsecase_1.FetchCaseByCaseidsUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new FetchCasesByCaseTypesIdsController_1.FetchCaseByCaseTypesIdsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
