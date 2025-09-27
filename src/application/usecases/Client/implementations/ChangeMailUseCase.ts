import { ResposeUserDto } from "@src/application/dtos/user.dto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IChangeMailUseCase } from "../IChangeMailUseCase";

export class ChangeMailUseCase implements IChangeMailUseCase {
    constructor(
        private userRepository: IUserRepository,
        private nodemailerProvider: INodeMailerProvider,
        private tokenProvider: IJwtProvider,
    ) {}
    async execute(input: { email: string; user_id: string }): Promise<ResposeUserDto> {
        try {
            const userDetails = await this.userRepository.findByuser_id(input.user_id);
            if (!userDetails) {
                throw new Error("NO_USER_FOUND");
            }
            const userExist = await this.userRepository.findByEmail(input.email);
            if (userExist?.email) {
                throw new Error("EMAIL_ALREADY_EXIST");
            }
            // console.log("email", email);
            await this.userRepository.update({
                email: input.email,
                user_id: input.user_id,
                is_verified: false,
            });
            // console.log("email updated");
            const otp = generateOtp();
            const token = this.tokenProvider.GenerateEmailToken({
                user_id: input.user_id,
            });
            try {
                await this.nodemailerProvider.sendVerificationMail(input.email, token, otp);
            } catch (error) {
                throw new Error("MAIL_SEND_ERROR");
            }
            return new ResposeUserDto({
                email: input.email,
                name: userDetails.name,
                role: userDetails.role,
                user_id: userDetails.user_id,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
