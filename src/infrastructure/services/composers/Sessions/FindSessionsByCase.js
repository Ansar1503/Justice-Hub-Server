"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSessionsByCaseComposer = FindSessionsByCaseComposer;
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const FetchCaseSessionsController_1 = require("@interfaces/controller/Cases/FetchCaseSessionsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCaseSessionUsecase_1 = require("@src/application/usecases/Case/Implimentations/FetchCaseSessionUsecase");
function FindSessionsByCaseComposer() {
    const usecase = new FetchCaseSessionUsecase_1.FetchCaseSessionUsecase(new SessionRepo_1.SessionsRepository());
    return new FetchCaseSessionsController_1.FetchCaseSessionController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
