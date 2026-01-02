"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@interfaces/adapters/express");
const RegisterUser_1 = require("@infrastructure/services/composers/Auth/RegisterUser");
const LoginUserComposer_1 = require("@infrastructure/services/composers/Auth/LoginUserComposer");
const RefreshToken_1 = require("@infrastructure/services/composers/Auth/RefreshToken");
const VerifyEmailComposer_1 = require("@infrastructure/services/composers/Auth/VerifyEmailComposer");
const VerifyEmailOtpComposer_1 = require("@infrastructure/services/composers/Auth/VerifyEmailOtpComposer");
const ResendOtpComposer_1 = require("@infrastructure/services/composers/Auth/ResendOtpComposer");
const RouteConstant_1 = require("@shared/constant/RouteConstant");
const validation_middleware_1 = require("../middelwares/validator/validation.middleware");
const user_validator_1 = require("../middelwares/validator/user.validator");
const GoogleAuthComposer_1 = require("@infrastructure/services/composers/Auth/GoogleAuthComposer");
const ForgotPasswordComposer_1 = require("@infrastructure/services/composers/Auth/ForgotPasswordComposer");
const ResetPasswordComposer_1 = require("@infrastructure/services/composers/Auth/ResetPasswordComposer");
const router = express_1.default.Router();
router.post(RouteConstant_1.AuthRoute.signup, user_validator_1.validateUser, validation_middleware_1.handleValidationErrors, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, RegisterUser_1.RegisterUserComponser)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.post(RouteConstant_1.AuthRoute.login, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, LoginUserComposer_1.LoginUserComposer)());
    res.cookie("refresh", adaper.body?.refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.get(RouteConstant_1.AuthRoute.refresh, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, RefreshToken_1.RefreshTokenComposer)());
    // console.log("adapter : ", adaper);
    res.status(adaper.statusCode).json(adaper.body);
});
router.get(RouteConstant_1.AuthRoute.verifyMail, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, VerifyEmailComposer_1.VerifyEmailComposer)());
    if (adaper.body?.redirectUrl) {
        res.redirect(adaper.body?.redirectUrl);
        return;
    }
});
router.post(RouteConstant_1.AuthRoute.verifyOtp, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, VerifyEmailOtpComposer_1.VerifyEmailOtpComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.post(RouteConstant_1.AuthRoute.resendOtp, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ResendOtpComposer_1.ResendOtpComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.AuthRoute.google, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GoogleAuthComposer_1.GoogleAuthComposer)());
    res.cookie("refresh", adapter.body?.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.AuthRoute.forgotPassword, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ForgotPasswordComposer_1.ForgotPasswordComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.AuthRoute.resetPassword, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ResetPasswordComposer_1.ResetPasswordComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
exports.default = router;
