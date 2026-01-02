"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const user_dto_1 = require("@src/application/dtos/user.dto");
class LoginUserUseCase {
    userRepo;
    passwordManager;
    tokenManager;
    constructor(userRepo, passwordManager, tokenManager) {
        this.userRepo = userRepo;
        this.passwordManager = passwordManager;
        this.tokenManager = tokenManager;
    }
    async execute(input) {
        let user;
        try {
            user = await this.userRepo.findByEmail(input.email);
        }
        catch (error) {
            throw new Error("DB_ERROR");
        }
        if (!user)
            throw new Error("USER_NOT_FOUND");
        const isMatch = await this.passwordManager.comparePasswords(input.password, user.password);
        if (!isMatch)
            throw new Error("INVALID_PASSWORD");
        if (user.is_blocked)
            throw new Error("USER_BLOCKED");
        const paylod = {
            id: user.user_id,
            email: user.email,
            role: user.role,
            status: user.is_blocked,
        };
        const accesstoken = this.tokenManager.GenerateAccessToken(paylod);
        const refreshtoken = this.tokenManager.GenerateRefreshToken(paylod);
        return { user: new user_dto_1.ResposeUserDto(user), accesstoken, refreshtoken };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
