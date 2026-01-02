"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndCallComposer = EndCallComposer;
const CallLogsRepo_1 = require("@infrastructure/database/repo/CallLogsRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const EndCallController_1 = require("@interfaces/controller/Lawyer/EndCallController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const EndCallUsecase_1 = require("@src/application/usecases/Lawyer/implementations/EndCallUsecase");
function EndCallComposer() {
    const usecase = new EndCallUsecase_1.EndCallUsecase(new UserRepo_1.UserRepository(), new SessionRepo_1.SessionsRepository(), new CallLogsRepo_1.CallLogsRepository());
    return new EndCallController_1.EndCallController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
