"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserComponser = RegisterUserComponser;
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const NodeMailerProvider_1 = require("@infrastructure/Providers/NodeMailerProvider");
const PasswordHasher_1 = require("@infrastructure/Providers/PasswordHasher");
const RegisterUser_1 = require("@interfaces/controller/Auth/RegisterUser");
const RegisterUserUseCase_1 = require("@src/application/usecases/Auth/implementation/RegisterUserUseCase");
function RegisterUserComponser() {
    const passwordHasher = new PasswordHasher_1.PasswordManager();
    const nodeMailerProvider = new NodeMailerProvider_1.NodeMailerProvider();
    const jwtProvider = new JwtProvider_1.JwtProvider();
    const usecase = new RegisterUserUseCase_1.RegisterUserUseCase(passwordHasher, nodeMailerProvider, jwtProvider, new UnitofWork_1.MongoUnitofWork());
    const controller = new RegisterUser_1.RegisterUser(usecase);
    return controller;
}
