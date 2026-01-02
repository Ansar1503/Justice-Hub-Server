"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartSessionComposer = StartSessionComposer;
const StartSessionController_1 = require("@interfaces/controller/Lawyer/Sessions/StartSessionController");
const StartSessionUseCase_1 = require("@src/application/usecases/Lawyer/implementations/StartSessionUseCase");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
function StartSessionComposer() {
    const usecase = new StartSessionUseCase_1.StartSessionUseCase(new SessionRepo_1.SessionsRepository(), new AppointmentsRepo_1.AppointmentsRepository(), new UnitofWork_1.MongoUnitofWork());
    return new StartSessionController_1.StartSessionController(usecase);
}
