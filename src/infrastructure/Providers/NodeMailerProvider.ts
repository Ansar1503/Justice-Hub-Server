import nodemailer from "nodemailer";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import "dotenv/config";

export class NodeMailerProvider implements INodeMailerProvider {
    private _smtpUser = process.env.SMTP_USER;
    private _smtpPass = process.env.SMTP_PASS;
    private _baseUrl = process.env.BASE_URL;
    private _transporter;
    constructor() {
        this._transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: this._smtpUser,
                pass: this._smtpPass,
            },
        });
    }

    async sendVerificationMail(email: string, token: string, otp: string): Promise<void> {
        const mailoptions = {
            from: this._smtpUser,
            to: email,
            subject: "Verification mail",
            html: `<h2> Justice Hub verify Mail</h2><br/>
            <p>Click <button><a href="${
    this._baseUrl
}/api/user/verify-email?token=${token}&email=${email}">here</a></button> to verify your email.</p><br/>
            ${
    otp &&
                `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to verify your email</p>`
}`,
        };
        try {
            await this._transporter.sendMail(mailoptions);
        } catch (error) {
            throw new Error("MAIL_SEND_ERROR");
        }
    }
}
