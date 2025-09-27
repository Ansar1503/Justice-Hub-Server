import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { User } from "@domain/entities/User";
import {
    RegisterUserDto,
    ResposeUserDto,
} from "@src/application/dtos/user.dto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IPasswordManager } from "@src/application/providers/PasswordHasher";
import { Client } from "@domain/entities/Client";
import { Lawyer } from "@domain/entities/Lawyer";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { generateOtp } from "@infrastructure/services/OtpManager/GenerateOtp";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import { IJwtProvider } from "@src/application/providers/JwtProvider";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { Otp } from "@domain/entities/Otp";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { Wallet } from "@domain/entities/Wallet";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";
import { IRegiserUserUseCase } from "../IRegisterUserUseCase";

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
