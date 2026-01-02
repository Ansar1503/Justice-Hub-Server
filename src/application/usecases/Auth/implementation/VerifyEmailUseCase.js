"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailUseCase = void 0;
class VerifyEmailUseCase {
    userRepo;
    otpRepo;
    jwtManager;
    constructor(userRepo, otpRepo, jwtManager) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.jwtManager = jwtManager;
    }
    async execute(input) {
        try {
            const user = await this.userRepo.findByEmail(input.email);
            if (!user) {
                // console.log("user not found", user);
                throw new Error("USER_NOT_FOUND");
            }
            if (user.is_blocked) {
                throw new Error("USER_BLOCKED");
            }
            if (user.is_verified) {
                throw new Error("USER_VERIFIED");
            }
            await this.jwtManager.VerifyEmailToken(input.token);
            await this.userRepo.update({ email: input.email, is_verified: true });
            await this.otpRepo.delete(input.email);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}
exports.VerifyEmailUseCase = VerifyEmailUseCase;
