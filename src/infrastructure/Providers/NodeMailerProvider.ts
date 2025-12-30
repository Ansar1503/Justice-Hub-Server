import nodemailer from "nodemailer";
import { INodeMailerProvider } from "@src/application/providers/NodeMailerProvider";
import "dotenv/config";

export class NodeMailerProvider implements INodeMailerProvider {
  private smtpUser = process.env.SMTP_USER;
  private smtpPass = process.env.SMTP_PASS;
  private baseUrl = process.env.BASE_URL;
  private frontendURL = process.env.FRONTEND_URL;
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: this.smtpUser,
        pass: this.smtpPass,
      },
    });
  }

  async sendVerificationMail(
    email: string,
    token: string,
    otp: string
  ): Promise<void> {
    const mailoptions = {
      from: this.smtpUser,
      to: email,
      subject: "Verification mail",
      html: `<h2> Justice Hub verify Mail</h2><br/>
            <p>Click <button><a href="${
              this.baseUrl
            }/api/user/verify-email?token=${token}&email=${email}">here</a></button> to verify your email.</p><br/>
            ${
              otp &&
              `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to verify your email</p>`
            }`,
    };
    try {
      await this.transporter.sendMail(mailoptions);
    } catch (error) {
      throw new Error("MAIL_SEND_ERROR");
    }
  }
  async sendForgotPasswordMail(
    email: string,
    token: string,
    otp: string
  ): Promise<void> {
    const mailoptions = {
      from: this.smtpUser,
      to: email,
      subject: "Reset Password",
      html: `
            <h2> Justice Hub Reset Password</h2><br/>
            <p>Click <button><a href="${this.frontendURL}/reset-password?token=${token}&email=${email}">here</a></button> to reset your password.</p><br/>
            ${
              otp &&
              `<h4>or</h4> <br/>
            <p>use this <h3>${otp}</h3> otp to reset your password</p>`
            }`,
    };
    try {
      await this.transporter.sendMail(mailoptions);
    } catch (error) {
      throw new Error("MAIL_SEND_ERROR");
    }
  }
}
