"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllCasesByQueryComposer = FindAllCasesByQueryComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FetchAllCasesByQueryController_1 = require("@interfaces/controller/Cases/FetchAllCasesByQueryController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCasesByQuery_1 = require("@src/application/usecases/Case/Implimentations/FetchCasesByQuery");
function FindAllCasesByQueryComposer() {
    const usecase = new FetchCasesByQuery_1.FetchAllCasesByQueryUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new FetchAllCasesByQueryController_1.FetchAllCasesByQueryController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
