import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
console.log({
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
});
export const sendVerificationEmail = async (
  email: string,
  user_id: string,
  otp: string
): Promise<void> => {
  const token = jwt.sign({ user_id }, process.env.JWT_EMAIL_SECRET as string, {
    expiresIn: "15min",
  });

  const mailoptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Verification mail",
    html: `<h2> Justice Hub verify Mail</h2><br/>
            <p>Click <button><a href="${process.env.BASE_URL}/api/user/verify-email?token=${token}&email=${email}">here</a></button> to verify your email.</p><br/>
            <h4>or</h4> <br/>
            <p>use this ${otp} otp to verify your email</p>`,
  };

  await transporter.sendMail(mailoptions);
};

export const emailVerification = (email: string, token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_EMAIL_SECRET as string);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("TOKEN_EXPIRED");
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("INVALID_TOKEN");
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error("TOKEN_NOT_ACTIVE");
    } else {
      throw new Error("AUTH_FAIL");
    }
  }
};

