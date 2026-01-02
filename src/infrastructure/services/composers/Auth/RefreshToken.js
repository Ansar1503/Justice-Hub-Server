"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenComposer = RefreshTokenComposer;
const JwtProvider_1 = require("@infrastructure/Providers/JwtProvider");
const RefreshToken_1 = require("@interfaces/controller/Auth/RefreshToken");
const UserReAuthUseCase_1 = require("@src/application/usecases/Auth/implementation/UserReAuthUseCase");
function RefreshTokenComposer() {
    const jwtManager = new JwtProvider_1.JwtProvider();
    const usecase = new UserReAuthUseCase_1.UserReAuthUseCase(jwtManager);
    const controller = new RefreshToken_1.RefreshToken(usecase);
    return controller;
}
