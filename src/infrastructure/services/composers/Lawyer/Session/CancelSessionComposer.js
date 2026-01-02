"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSessionComposer = CancelSessionComposer;
const CancelSessionController_1 = require("@interfaces/controller/Lawyer/Sessions/CancelSessionController");
const CancelSessionUseCase_1 = require("@src/application/usecases/Lawyer/implementations/CancelSessionUseCase");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
function CancelSessionComposer() {
    const usecase = new CancelSessionUseCase_1.CancelSessionUseCase(new SessionRepo_1.SessionsRepository(), new AppointmentsRepo_1.AppointmentsRepository(), new UnitofWork_1.MongoUnitofWork());
    return new CancelSessionController_1.CancelSessionController(usecase);
}
