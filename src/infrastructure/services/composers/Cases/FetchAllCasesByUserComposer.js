"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllCasesByUserComposer = FetchAllCasesByUserComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FetchAllCasesByUserController_1 = require("@interfaces/controller/Cases/FetchAllCasesByUserController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAllCasesByUserUsecase_1 = require("@src/application/usecases/Case/Implimentations/FetchAllCasesByUserUsecase");
function FetchAllCasesByUserComposer() {
    const usecase = new FetchAllCasesByUserUsecase_1.FetchAllCasesByUserUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new FetchAllCasesByUserController_1.FetchAllCasesByUserController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
