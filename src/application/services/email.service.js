"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerification = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendVerificationEmail = async (email, user_id, otp) => {
    const token = jsonwebtoken_1.default.sign({ user_id }, process.env.JWT_EMAIL_SECRET, {
        expiresIn: "15min",
    });
    const mailoptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Verification mail",
        html: `<h2> Justice Hub verify Mail</h2><br/>
            <p>Click <button><a href="${process.env.BASE_URL}/api/user/verify-email?token=${token}&email=${email}">here</a></button> to verify your email.</p><br/>
            ${otp &&
            `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to verify your email</p>`}`,
    };
    try {
        await transporter.sendMail(mailoptions);
    }
    catch (error) {
        throw new Error("MAIL_SEND_ERROR");
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const emailVerification = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_EMAIL_SECRET);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error("TOKEN_EXPIRED");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error("INVALID_TOKEN");
        }
        else if (error instanceof jsonwebtoken_1.default.NotBeforeError) {
            throw new Error("TOKEN_NOT_ACTIVE");
        }
        else {
            throw new Error("AUTH_FAIL");
        }
    }
};
exports.emailVerification = emailVerification;
