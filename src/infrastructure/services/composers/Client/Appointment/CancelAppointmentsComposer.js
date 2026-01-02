"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelAppointmentComposer = CancelAppointmentComposer;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const CancelAppoitmentController_1 = require("@interfaces/controller/Client/Appointment/CancelAppoitmentController");
const CancelAppointmentUseCase_1 = require("@src/application/usecases/Client/implementations/CancelAppointmentUseCase");
function CancelAppointmentComposer() {
    const useCase = new CancelAppointmentUseCase_1.CancelAppointmentUseCase(new AppointmentsRepo_1.AppointmentsRepository(), new UnitofWork_1.MongoUnitofWork());
    return new CancelAppoitmentController_1.CancelAppointmentController(useCase);
}
