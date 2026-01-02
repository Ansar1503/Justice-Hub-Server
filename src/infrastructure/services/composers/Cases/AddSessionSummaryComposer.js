"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSessionSummaryComposer = AddSessionSummaryComposer;
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const AddSessionSummaryController_1 = require("@interfaces/controller/Cases/AddSessionSummaryController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const AddSessionSummaryUsecase_1 = require("@src/application/usecases/Case/Implimentations/AddSessionSummaryUsecase");
function AddSessionSummaryComposer() {
    const usecase = new AddSessionSummaryUsecase_1.AddSessionSummaryUsecase(new SessionRepo_1.SessionsRepository());
    return new AddSessionSummaryController_1.AddSessionSummaryController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
