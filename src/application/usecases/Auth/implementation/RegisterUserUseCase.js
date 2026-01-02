"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const User_1 = require("@domain/entities/User");
const user_dto_1 = require("@src/application/dtos/user.dto");
const CustomError_1 = require("@interfaces/middelwares/Error/CustomError");
const Client_1 = require("@domain/entities/Client");
const GenerateOtp_1 = require("@infrastructure/services/OtpManager/GenerateOtp");
const Otp_1 = require("@domain/entities/Otp");
const Wallet_1 = require("@domain/entities/Wallet");
const UserSubscriptionPlan_1 = require("@domain/entities/UserSubscriptionPlan");
class RegisterUserUseCase {
    _passwordHasher;
    _nodemailProvider;
    _jwtprovider;
    _unitOfWork;
    constructor(_passwordHasher, _nodemailProvider, _jwtprovider, _unitOfWork) {
        this._passwordHasher = _passwordHasher;
        this._nodemailProvider = _nodemailProvider;
        this._jwtprovider = _jwtprovider;
        this._unitOfWork = _unitOfWork;
    }
    async execute(input) {
        return await this._unitOfWork.startTransaction(async (uow) => {
            const existingUser = await uow.userRepo.findByEmail(input.email);
            if (existingUser) {
                throw new CustomError_1.ValidationError("User Already Exists");
            }
            const hashedPassword = await this._passwordHasher.hashPassword(input.password);
            const newUser = User_1.User.create(input);
            newUser.changePassword(hashedPassword);
            const user = await uow.userRepo.create(newUser);
            const client = Client_1.Client.create({
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
                    const userSub = UserSubscriptionPlan_1.UserSubscription.create({
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
            const otp = await (0, GenerateOtp_1.generateOtp)();
            const token = await this._jwtprovider.GenerateEmailToken({
                user_id: user.user_id,
            });
            try {
                const walletPayload = Wallet_1.Wallet.create({
                    user_id: user.user_id,
                });
                await uow.walletRepo.create(walletPayload);
            }
            catch (error) { }
            const otpdata = Otp_1.Otp.create({ email: user.email, otp });
            await uow.otpRepo.storeOtp(otpdata);
            try {
                await this._nodemailProvider.sendVerificationMail(user.email, token, otp);
            }
            catch (error) {
                throw new Error("MAIL_SEND_ERROR");
            }
            return new user_dto_1.ResposeUserDto(user);
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
