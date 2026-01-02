"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordComposer = ResetPasswordComposer;
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const PasswordHasher_1 = require("@infrastructure/Providers/PasswordHasher");
const ResetPasswordController_1 = require("@interfaces/controller/Auth/ResetPasswordController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const ResetPasswordUsecase_1 = require("@src/application/usecases/Auth/implementation/ResetPasswordUsecase");
function ResetPasswordComposer() {
    const usecase = new ResetPasswordUsecase_1.ResetPasswordUsecase(new UserRepo_1.UserRepository(), new JwtProvider_1.JwtProvider(), new PasswordHasher_1.PasswordManager());
    return new ResetPasswordController_1.ResetPasswordController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
