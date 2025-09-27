import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { Otp } from "@domain/entities/Otp";
import { token } from "morgan";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IResendOtpUseCase } from "../IResendOtpUseCase";

export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository,
    private emailProvider: INodeMailerProvider,
    private tokenProvider: IJwtProvider
    ) {}
    async execute(input: string): Promise<void> {
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
        const otp = generateOtp();
        const token = this.tokenProvider.GenerateEmailToken({
            user_id: user.user_id,
        });
        try {
            await this.emailProvider.sendVerificationMail(user.email, token, otp);
        } catch (error: any) {
            throw new Error("MAIL_SEND_ERROR");
        }
        try {
            const newotp = Otp.create({ email: input, otp: otp });
            await this.otpRepo.storeOtp(newotp);
        } catch (error: any) {
            throw new Error("DB_ERROR");
        }
    }
}
