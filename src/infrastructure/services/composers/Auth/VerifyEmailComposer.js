"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailComposer = VerifyEmailComposer;
const VerifyEmailController_1 = require("@interfaces/controller/Auth/VerifyEmailController");
const OtpRepo_1 = require("@infrastructure/database/repo/OtpRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const VerifyEmailUseCase_1 = require("@src/application/usecases/Auth/implementation/VerifyEmailUseCase");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
function VerifyEmailComposer() {
    const userrepo = new UserRepo_1.UserRepository();
    const otprepo = new OtpRepo_1.OtpRepository();
    const jwtManager = new JwtProvider_1.JwtProvider();
    const usecase = new VerifyEmailUseCase_1.VerifyEmailUseCase(userrepo, otprepo, jwtManager);
    const controller = new VerifyEmailController_1.VerifyEmailController(usecase);
    return controller;
}
