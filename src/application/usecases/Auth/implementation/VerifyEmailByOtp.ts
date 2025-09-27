import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IVerifyEmailByOtp } from "../IVerifyEmailByOtp";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { VerifyEmailByOtpInput } from "@src/application/dtos/Auth/VerifyEmailDto";

export class VerifyEmailByOtpUseCase implements IVerifyEmailByOtp {
    constructor(
    private userRepo: IUserRepository,
    private otpRepo: IOtpRepository
    ) {}
    async execute(input: VerifyEmailByOtpInput): Promise<void> {
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
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
