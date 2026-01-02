"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookFollowupAppointmentByWalletComposer = BookFollowupAppointmentByWalletComposer;
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const BookFollowupAppointmentByWallet_1 = require("@interfaces/controller/Appointments/BookFollowupAppointmentByWallet");
const BookFollowupAppointmentByWalletUsecase_1 = require("@src/application/usecases/Appointments/implementations/BookFollowupAppointmentByWalletUsecase");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
function BookFollowupAppointmentByWalletComposer() {
    const usecase = new BookFollowupAppointmentByWalletUsecase_1.BookFollowupAppointmentByWalletUsecase(new UnitofWork_1.MongoUnitofWork(), new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()));
    return new BookFollowupAppointmentByWallet_1.BookFollowupAppointmentByWalletController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
