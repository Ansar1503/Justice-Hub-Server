"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookAppointmentByWalletComposer = BookAppointmentByWalletComposer;
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
const BookAppointmentByWallet_1 = require("@interfaces/controller/Appointments/BookAppointmentByWallet");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const BookAppointmentsByWalletUsecase_1 = require("@src/application/usecases/Appointments/implementations/BookAppointmentsByWalletUsecase");
function BookAppointmentByWalletComposer() {
    const uscase = new BookAppointmentsByWalletUsecase_1.BookAppointmentByWalletUsecase(new UnitofWork_1.MongoUnitofWork(), new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()));
    return new BookAppointmentByWallet_1.BookAppointmentByWalletController(uscase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
