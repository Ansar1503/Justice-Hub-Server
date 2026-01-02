"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpComposer = ResendOtpComposer;
const OtpRepo_1 = require("@infrastructure/database/repo/OtpRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const NodeMailerProvider_1 = require("@infrastructure/Providers/NodeMailerProvider");
const ResendOtp_1 = require("@interfaces/controller/Auth/ResendOtp");
const ResendOtpUseCase_1 = require("@src/application/usecases/Auth/implementation/ResendOtpUseCase");
function ResendOtpComposer() {
    const userrepo = new UserRepo_1.UserRepository();
    const otprepo = new OtpRepo_1.OtpRepository();
    const emailProvider = new NodeMailerProvider_1.NodeMailerProvider();
    const tokentProvider = new JwtProvider_1.JwtProvider();
    const usecase = new ResendOtpUseCase_1.ResendOtpUseCase(userrepo, otprepo, emailProvider, tokentProvider);
    const controller = new ResendOtp_1.ResendOtpController(usecase);
    return controller;
}
