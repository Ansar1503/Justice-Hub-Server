"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAppointmentByCaseComposer = FindAppointmentByCaseComposer;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const FindAppointmentsByCaseController_1 = require("@interfaces/controller/Appointments/FindAppointmentsByCaseController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindAppointmentsByCaseUsecase_1 = require("@src/application/usecases/Appointments/implementations/FindAppointmentsByCaseUsecase");
function FindAppointmentByCaseComposer() {
    const usecase = new FindAppointmentsByCaseUsecase_1.FindAppointmentsByCaseUsecase(new AppointmentsRepo_1.AppointmentsRepository(), new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()));
    return new FindAppointmentsByCaseController_1.FindAppointmentByCaseController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
