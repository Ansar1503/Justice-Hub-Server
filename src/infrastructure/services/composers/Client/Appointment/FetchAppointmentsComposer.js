"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAppointmentDataComposer = FetchAppointmentDataComposer;
const FetchAppointmentDataController_1 = require("@interfaces/controller/Client/Appointment/FetchAppointmentDataController");
const FetchAppointmentsClientUsecase_1 = require("@src/application/usecases/Client/implementations/FetchAppointmentsClientUsecase");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
function FetchAppointmentDataComposer() {
    const useCase = new FetchAppointmentsClientUsecase_1.FetchAppointmentsClientUseCase(new AppointmentsRepo_1.AppointmentsRepository());
    return new FetchAppointmentDataController_1.FetchAppointmentDataController(useCase);
}
