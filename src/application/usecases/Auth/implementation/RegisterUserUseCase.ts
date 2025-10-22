import { User } from "@domain/entities/User";
import {
  RegisterUserDto,
  ResposeUserDto,
} from "@src/application/dtos/user.dto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import { Client } from "@domain/entities/Client";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { Otp } from "@domain/entities/Otp";
import { Wallet } from "@domain/entities/Wallet";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { IRegiserUserUseCase } from "../IRegisterUserUseCase";
import { UserSubscription } from "@domain/entities/UserSubscriptionPlan";

export class RegisterUserUseCase implements IRegiserUserUseCase {
  constructor(
    private passwordHasher: IPasswordManager,
    private nodemailProvider: INodeMailerProvider,
    private jwtprovider: IJwtProvider,
    private _unitOfWork: IUnitofWork
  ) {}
  async execute(input: RegisterUserDto): Promise<ResposeUserDto> {
    return await this._unitOfWork.startTransaction(async (uow) => {
      const existingUser = await uow.userRepo.findByEmail(input.email);
      if (existingUser) {
        throw new ValidationError("User Already Exists");
      }
      const hashedPassword = await this.passwordHasher.hashPassword(
        input.password
      );
      const newUser = User.create(input);
      newUser.changePassword(hashedPassword);

      const user = await uow.userRepo.create(newUser);
      const client = Client.create({
        user_id: user.user_id,
        profile_image: "",
        address: "",
        dob: "",
        gender: "",
      });
      await uow.clientRepo.create(client);
      if (user.role === "client") {
        const freePlan = await uow.subscriptionRepo.findFreeTier();
        if (freePlan) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          const benefits = freePlan.benefits;
          const userSub = UserSubscription.create({
            benefitsSnapshot: {
              autoRenew: benefits.autoRenew,
              bookingsPerMonth: benefits.bookingsPerMonth,
              chatAccess: benefits.chatAccess,
              discountPercent: benefits.discountPercent,
              documentUploadLimit: benefits.documentUploadLimit,
              expiryAlert: benefits.expiryAlert,
              followupBookingsPerCase: benefits.followupBookingsPerCase,
            },
            userId: user.user_id,
            planId: freePlan.id,
            startDate: new Date(),
            autoRenew: false,
            endDate: endDate,
          });
          await uow.userSubscriptionRepo.create(userSub);
        }
      }
      const otp = await generateOtp();
      const token = await this.jwtprovider.GenerateEmailToken({
        user_id: user.user_id,
      });
      try {
        const walletPayload = Wallet.create({
          user_id: user.user_id,
        });
        await uow.walletRepo.create(walletPayload);
      } catch (error) {}
      const otpdata = Otp.create({ email: user.email, otp });
      await uow.otpRepo.storeOtp(otpdata);
      try {
        await this.nodemailProvider.sendVerificationMail(
          user.email,
          token,
          otp
        );
      } catch (error) {
        throw new Error("MAIL_SEND_ERROR");
      }
      return new ResposeUserDto(user);
    });
  }
}
