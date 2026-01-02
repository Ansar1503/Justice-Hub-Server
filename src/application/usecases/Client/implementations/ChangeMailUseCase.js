"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeMailUseCase = void 0;
const user_dto_1 = require("@src/application/dtos/user.dto");
const GenerateOtp_1 = require("@infrastructure/services/OtpManager/GenerateOtp");
class ChangeMailUseCase {
    userRepository;
    nodemailerProvider;
    tokenProvider;
    constructor(userRepository, nodemailerProvider, tokenProvider) {
        this.userRepository = userRepository;
        this.nodemailerProvider = nodemailerProvider;
        this.tokenProvider = tokenProvider;
    }
    async execute(input) {
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
            const otp = (0, GenerateOtp_1.generateOtp)();
            const token = this.tokenProvider.GenerateEmailToken({
                user_id: input.user_id,
            });
            try {
                await this.nodemailerProvider.sendVerificationMail(input.email, token, otp);
            }
            catch (error) {
                throw new Error("MAIL_SEND_ERROR");
            }
            return new user_dto_1.ResposeUserDto({
                email: input.email,
                name: userDetails.name,
                role: userDetails.role,
                user_id: userDetails.user_id,
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.ChangeMailUseCase = ChangeMailUseCase;
