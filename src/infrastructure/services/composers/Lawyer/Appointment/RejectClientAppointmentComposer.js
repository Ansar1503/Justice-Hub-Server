"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectClientAppointmentComposer = RejectClientAppointmentComposer;
const RejectClientAppoinment_1 = require("@interfaces/controller/Lawyer/Appointments/RejectClientAppoinment");
const RejectAppointmentUseCase_1 = require("@src/application/usecases/Lawyer/implementations/RejectAppointmentUseCase");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
function RejectClientAppointmentComposer() {
    const usecase = new RejectAppointmentUseCase_1.RejectAppointmentUseCase(new AppointmentsRepo_1.AppointmentsRepository(), new UnitofWork_1.MongoUnitofWork());
    return new RejectClientAppoinment_1.RejectClientAppointmentController(usecase);
}
