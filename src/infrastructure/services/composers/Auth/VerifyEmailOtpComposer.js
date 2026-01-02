"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailOtpComposer = VerifyEmailOtpComposer;
const OtpRepo_1 = require("@infrastructure/database/repo/OtpRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const VerifyEmailOtpController_1 = require("@interfaces/controller/Auth/VerifyEmailOtpController");
const VerifyEmailByOtp_1 = require("@src/application/usecases/Auth/implementation/VerifyEmailByOtp");
function VerifyEmailOtpComposer() {
    const userrepo = new UserRepo_1.UserRepository();
    const otprepo = new OtpRepo_1.OtpRepository();
    const usecase = new VerifyEmailByOtp_1.VerifyEmailByOtpUseCase(userrepo, otprepo);
    const controller = new VerifyEmailOtpController_1.VerifyEmailOtpController(usecase);
    return controller;
}
