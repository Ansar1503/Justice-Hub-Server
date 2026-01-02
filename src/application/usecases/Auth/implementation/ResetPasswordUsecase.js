"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUsecase = void 0;
class ResetPasswordUsecase {
    _userRepo;
    _jwtProvider;
    _passwordManager;
    constructor(_userRepo, _jwtProvider, _passwordManager) {
        this._userRepo = _userRepo;
        this._jwtProvider = _jwtProvider;
        this._passwordManager = _passwordManager;
    }
    async execute(input) {
        const tokenPayload = this._jwtProvider.VerifyEmailToken(input.token);
        if (!tokenPayload) {
            throw new Error("Invalid token");
        }
        const user = await this._userRepo.findByuser_id(tokenPayload.user_id);
        if (!user) {
            throw new Error("User not found");
        }
        const comparePassword = await this._passwordManager.comparePasswords(input.password, user.password);
        if (comparePassword) {
            throw new Error("New password same as old password");
        }
        const hashedPassword = await this._passwordManager.hashPassword(input.password);
        try {
            user.changePassword(hashedPassword);
            await this._userRepo.update(user);
        }
        catch (error) {
            throw new Error("Error updating password");
        }
    }
}
exports.ResetPasswordUsecase = ResetPasswordUsecase;
