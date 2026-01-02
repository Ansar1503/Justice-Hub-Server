"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserComposer = LoginUserComposer;
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const PasswordHasher_1 = require("@infrastructure/Providers/PasswordHasher");
const Login_1 = require("@interfaces/controller/Auth/Login");
const LoginUserUseCase_1 = require("@src/application/usecases/Auth/implementation/LoginUserUseCase");
function LoginUserComposer() {
    const userrepo = new UserRepo_1.UserRepository();
    const passwordManager = new PasswordHasher_1.PasswordManager();
    const tokenManager = new JwtProvider_1.JwtProvider();
    const usecase = new LoginUserUseCase_1.LoginUserUseCase(userrepo, passwordManager, tokenManager);
    const controller = new Login_1.LoginController(usecase);
    return controller;
}
