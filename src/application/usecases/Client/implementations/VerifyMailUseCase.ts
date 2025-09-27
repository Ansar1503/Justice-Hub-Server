import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { IVerifyMailUseCase } from "../IVerifyMailUseCase";

export class VerifyMailUseCase implements IVerifyMailUseCase {
    constructor(
        private mailProvider: INodeMailerProvider,
        private tokenProvider: IJwtProvider,
    ) {}
    async execute(input: { email: string; user_id: string }): Promise<void> {
        const otp = generateOtp();
        const token = this.tokenProvider.GenerateEmailToken({
            user_id: input.user_id,
        });
        try {
            await this.mailProvider.sendVerificationMail(input.email, token, otp);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
