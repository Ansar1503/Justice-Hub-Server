"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailByOtpUseCase = void 0;
class VerifyEmailByOtpUseCase {
    userRepo;
    otpRepo;
    constructor(userRepo, otpRepo) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
    }
    async execute(input) {
        try {
            const user = await this.userRepo.findByEmail(input.email);
            if (!user) {
                throw new Error("INVALID_EMAIL");
            }
            if (user.is_verified) {
                throw new Error("USER_VERIFIED");
            }
            if (user.is_blocked) {
                throw new Error("USER_BLOCKED");
            }
            const otpdata = await this.otpRepo.findOtp(input.email);
            if (!otpdata || input.otp !== otpdata.otp) {
                throw new Error("invalid otp");
            }
            if (Date.now() > otpdata.expiresAt.getTime()) {
                throw new Error("OTP_EXPIRED");
            }
            await this.otpRepo.delete(input.email);
            await this.userRepo.update({ email: input.email, is_verified: true });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.VerifyEmailByOtpUseCase = VerifyEmailByOtpUseCase;
