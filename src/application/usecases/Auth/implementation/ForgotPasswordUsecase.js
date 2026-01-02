"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordUsecase = void 0;
const GenerateOtp_1 = require("@infrastructure/services/OtpManager/GenerateOtp");
const Otp_1 = require("@domain/entities/Otp");
class ForgotPasswordUsecase {
    _userRepo;
    _jwtprovider;
    _nodemailProvider;
    _otpRepo;
    constructor(_userRepo, _jwtprovider, _nodemailProvider, _otpRepo) {
        this._userRepo = _userRepo;
        this._jwtprovider = _jwtprovider;
        this._nodemailProvider = _nodemailProvider;
        this._otpRepo = _otpRepo;
    }
    async execute(input) {
        const user = await this._userRepo.findByEmail(input.email);
        if (!user) {
            throw new Error("User not found");
        }
        const token = await this._jwtprovider.GenerateEmailToken({
            user_id: user.user_id,
        });
        const otp = await (0, GenerateOtp_1.generateOtp)();
        try {
            await this._nodemailProvider.sendForgotPasswordMail(user.email, token, otp);
        }
        catch (error) {
            throw new Error("email send error!");
        }
        const otpData = Otp_1.Otp.create({ email: user.email, otp });
        await this._otpRepo.storeOtp(otpData);
    }
}
exports.ForgotPasswordUsecase = ForgotPasswordUsecase;
