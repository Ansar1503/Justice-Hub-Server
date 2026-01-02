"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOtpUseCase = void 0;
const GenerateOtp_1 = require("@infrastructure/services/OtpManager/GenerateOtp");
const Otp_1 = require("@domain/entities/Otp");
class ResendOtpUseCase {
    userRepo;
    otpRepo;
    emailProvider;
    tokenProvider;
    constructor(userRepo, otpRepo, emailProvider, tokenProvider) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.emailProvider = emailProvider;
        this.tokenProvider = tokenProvider;
    }
    async execute(input) {
        const user = await this.userRepo.findByEmail(input);
        if (!user) {
            throw new Error("INVALID_EMAIL");
        }
        if (user.is_verified) {
            throw new Error("USER_VERIFIED");
        }
        if (user.is_blocked) {
            throw new Error("USER_BLOCKED");
        }
        const otp = (0, GenerateOtp_1.generateOtp)();
        const token = this.tokenProvider.GenerateEmailToken({
            user_id: user.user_id,
        });
        try {
            await this.emailProvider.sendVerificationMail(user.email, token, otp);
        }
        catch (error) {
            throw new Error("MAIL_SEND_ERROR");
        }
        try {
            const newotp = Otp_1.Otp.create({ email: input, otp: otp });
            await this.otpRepo.storeOtp(newotp);
        }
        catch (error) {
            throw new Error("DB_ERROR");
        }
    }
}
exports.ResendOtpUseCase = ResendOtpUseCase;
