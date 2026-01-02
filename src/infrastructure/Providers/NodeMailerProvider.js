"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMailerProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
class NodeMailerProvider {
    smtpUser = process.env.SMTP_USER;
    smtpPass = process.env.SMTP_PASS;
    baseUrl = process.env.BASE_URL;
    frontendURL = process.env.FRONTEND_URL;
    transporter;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: this.smtpUser,
                pass: this.smtpPass,
            },
        });
    }
    async sendVerificationMail(email, token, otp) {
        const mailoptions = {
            from: this.smtpUser,
            to: email,
            subject: "Verification mail",
            html: `<h2> Justice Hub verify Mail</h2><br/>
            <p>Click <button><a href="${this.baseUrl}/api/user/verify-email?token=${token}&email=${email}">here</a></button> to verify your email.</p><br/>
            ${otp &&
                `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to verify your email</p>`}`,
        };
        try {
            await this.transporter.sendMail(mailoptions);
        }
        catch (error) {
            throw new Error("MAIL_SEND_ERROR");
        }
    }
    async sendForgotPasswordMail(email, token, otp) {
        const mailoptions = {
            from: this.smtpUser,
            to: email,
            subject: "Reset Password",
            html: `
            <h2> Justice Hub Reset Password</h2><br/>
            <p>Click <button><a href="${this.frontendURL}/reset-password?token=${token}&email=${email}">here</a></button> to reset your password.</p><br/>
            ${otp &&
                `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to reset your password</p>`}`,
        };
        try {
            await this.transporter.sendMail(mailoptions);
        }
        catch (error) {
            throw new Error("MAIL_SEND_ERROR");
        }
    }
}
exports.NodeMailerProvider = NodeMailerProvider;
