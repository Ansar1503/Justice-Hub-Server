import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { VerifyEmailByOtpInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IVerifyEmailByOtp } from "../IVerifyEmailByOtp";

export class VerifyEmailByOtpUseCase implements IVerifyEmailByOtp {
    constructor(
        private _userRepo: IUserRepository,
        private _otpRepo: IOtpRepository,
    ) {}
    async execute(input: VerifyEmailByOtpInput): Promise<void> {
        try {
            const user = await this._userRepo.findByEmail(input.email);
            if (!user) {
                throw new Error("INVALID_EMAIL");
            }
            if (user.is_verified) {
                throw new Error("USER_VERIFIED");
            }
            if (user.is_blocked) {
                throw new Error("USER_BLOCKED");
            }
            const otpdata = await this._otpRepo.findOtp(input.email);
            if (!otpdata || input.otp !== otpdata.otp) {
                throw new Error("invalid otp");
            }
            if (Date.now() > otpdata.expiresAt.getTime()) {
                throw new Error("OTP_EXPIRED");
            }
            await this._otpRepo.delete(input.email);
            await this._userRepo.update({ email: input.email, is_verified: true });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
