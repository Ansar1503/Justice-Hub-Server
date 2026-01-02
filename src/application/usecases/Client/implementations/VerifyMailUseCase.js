"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyMailUseCase = void 0;
const GenerateOtp_1 = require("@infrastructure/services/OtpManager/GenerateOtp");
class VerifyMailUseCase {
    mailProvider;
    tokenProvider;
    constructor(mailProvider, tokenProvider) {
        this.mailProvider = mailProvider;
        this.tokenProvider = tokenProvider;
    }
    async execute(input) {
        const otp = (0, GenerateOtp_1.generateOtp)();
        const token = this.tokenProvider.GenerateEmailToken({
            user_id: input.user_id,
        });
        try {
            await this.mailProvider.sendVerificationMail(input.email, token, otp);
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.VerifyMailUseCase = VerifyMailUseCase;
