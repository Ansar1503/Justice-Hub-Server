"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinVideoSessionComposer = JoinVideoSessionComposer;
const JoinVideoController_1 = require("@interfaces/controller/Lawyer/Sessions/JoinVideoController");
const JoinSessionUseCase_1 = require("@src/application/usecases/Lawyer/implementations/JoinSessionUseCase");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
function JoinVideoSessionComposer() {
    const usecase = new JoinSessionUseCase_1.JoinSessionUseCase(new SessionRepo_1.SessionsRepository(), new AppointmentsRepo_1.AppointmentsRepository(), new UserRepo_1.UserRepository());
    return new JoinVideoController_1.JoinVideoSessionController(usecase);
}
