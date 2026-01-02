"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordComposer = ForgotPasswordComposer;
const OtpRepo_1 = require("@infrastructure/database/repo/OtpRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const NodeMailerProvider_1 = require("@infrastructure/Providers/NodeMailerProvider");
const ForgotPasswordController_1 = require("@interfaces/controller/Auth/ForgotPasswordController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const ForgotPasswordUsecase_1 = require("@src/application/usecases/Auth/implementation/ForgotPasswordUsecase");
function ForgotPasswordComposer() {
    const usecase = new ForgotPasswordUsecase_1.ForgotPasswordUsecase(new UserRepo_1.UserRepository(), new JwtProvider_1.JwtProvider(), new NodeMailerProvider_1.NodeMailerProvider(), new OtpRepo_1.OtpRepository());
    return new ForgotPasswordController_1.ForgotPasswordController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
