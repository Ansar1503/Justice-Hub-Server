"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartCallComposer = StartCallComposer;
const CallLogsRepo_1 = require("@infrastructure/database/repo/CallLogsRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const StartCallController_1 = require("@interfaces/controller/Lawyer/StartCallController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StartCallUsecase_1 = require("@src/application/usecases/Lawyer/implementations/StartCallUsecase");
function StartCallComposer() {
    const usecase = new StartCallUsecase_1.StartCallUsecase(new SessionRepo_1.SessionsRepository(), new CallLogsRepo_1.CallLogsRepository(), new UserRepo_1.UserRepository());
    return new StartCallController_1.StartCallController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
