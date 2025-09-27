import { VerifyEmailInput } from "@src/application/dtos/Auth/VerifyEmailDto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { IVerifyEmailUseCase } from "../IVerifyEmailUseCase";

export class VerifyEmailUseCase implements IVerifyEmailUseCase {
    constructor(
        private userRepo: IUserRepository,
        private otpRepo: IOtpRepository,
        private jwtManager: IJwtProvider,
    ) {}
    async execute(input: VerifyEmailInput): Promise<void> {
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
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }
}
