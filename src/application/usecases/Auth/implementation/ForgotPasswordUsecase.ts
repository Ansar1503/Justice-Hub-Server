import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IForgotPasswordUsecase } from "../IForgotPasswordUsecase";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { Otp } from "@domain/entities/Otp";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";

export class ForgotPasswordUsecase implements IForgotPasswordUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _jwtprovider: IJwtProvider,
    private _nodemailProvider: INodeMailerProvider,
    private _otpRepo: IOtpRepository
  ) {}
  async execute(input: { email: string }): Promise<void> {
    const user = await this._userRepo.findByEmail(input.email);
    if (!user) {
      throw new Error("User not found");
    }
    const token = await this._jwtprovider.GenerateEmailToken({
      user_id: user.user_id,
    });
    const otp = await generateOtp();
    try {
      await this._nodemailProvider.sendForgotPasswordMail(
        user.email,
        token,
        otp
      );
    } catch (error) {
      throw new Error("email send error!");
    }
    const otpData = Otp.create({ email: user.email, otp });
    await this._otpRepo.storeOtp(otpData);
  }
}
