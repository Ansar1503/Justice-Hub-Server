"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCaseDetailsComposer = FindCaseDetailsComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FetchCaseDetailsById_1 = require("@interfaces/controller/Cases/FetchCaseDetailsById");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindCaseDetailsUsecase_1 = require("@src/application/usecases/Case/Implimentations/FindCaseDetailsUsecase");
function FindCaseDetailsComposer() {
    const usecase = new FindCaseDetailsUsecase_1.FindCaseDetailsUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new FetchCaseDetailsById_1.FetchCaseDetailsControlller(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
