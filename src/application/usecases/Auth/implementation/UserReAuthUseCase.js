"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReAuthUseCase = void 0;
class UserReAuthUseCase {
    jwtManager;
    constructor(jwtManager) {
        this.jwtManager = jwtManager;
    }
    async execute(input) {
        const userpayload = this.jwtManager.VerifyRefreshToken(input);
        const accesstoken = this.jwtManager.GenerateAccessToken(userpayload);
        return accesstoken;
    }
}
exports.UserReAuthUseCase = UserReAuthUseCase;
