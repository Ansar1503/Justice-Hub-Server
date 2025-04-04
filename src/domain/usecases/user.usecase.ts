import { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../infrastructure/services/jwt.service";
import { ResposeUserDto } from "../dtos/user.dto";
import { User } from "../entities/User.entity";
import bcrypt from "bcryptjs";
import {
  emailVerification,
  sendVerificationEmail,
} from "../../infrastructure/services/email.service";
import { generateOtp } from "../../infrastructure/services/otp.service";
import { OtpRepository } from "../../infrastructure/database/repo/otp.repo";

export class UserUseCase {
  private userRepository: UserRepository;
  private otpRepository: OtpRepository;
  constructor(userRepository: UserRepository, otpRepository: OtpRepository) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepository;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createUser(userData: User): Promise<ResposeUserDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("USER_EXISTS");
    }
    userData.password = await this.hashPassword(userData.password);
    try {
      const user = await this.userRepository.create(userData);
      const otp = generateOtp();
      try {
        await sendVerificationEmail(user.email, user.user_id, otp);
        console.log("email send successfully");
      } catch (error) {
        console.log(error);
        throw new Error("MAIL_SEND_ERROR");
      }
      await this.otpRepository.storeOtp({
        email: user.email,
        otp: otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
      });
      return new ResposeUserDto(user);
    } catch (error: any) {
      console.log(error);
      if (error.message === "MAIL_SEND_ERROR") {
        throw new Error(error.message);
      }
      throw new Error("DB_ERROR");
    }
  }

  async userLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{
    user: ResposeUserDto;
    accesstoken: string;
    refreshtoken: string;
  }> {
    let user;
    try {
      user = await this.userRepository.findByEmail(email);
    } catch (error) {
      throw new Error("DB_ERROR");
    }
    if (!user) throw new Error("USER_NOT_FOUND");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("INVALID_PASSWORD");

    if (user.is_blocked) throw new Error("USER_BLOCKED");

    const accesstoken = generateAccessToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
      status: user.is_blocked as boolean,
    });

    const refreshtoken = generateRefreshToken({
      id: user.user_id,
      email: user.email,
      role: user.role,
      status: user.is_blocked as boolean,
    });

    return { user: new ResposeUserDto(user), accesstoken, refreshtoken };
  }

  userReAuth(token: string): string {
    const userpayload = verifyRefreshToken(token) as JwtPayload;
    const accesstoken = generateAccessToken({
      email: userpayload.email,
      id: userpayload.id,
      role: userpayload.role,
      status: userpayload.status,
    });

    return accesstoken;
  }

  async verifyEmail(email: string, token: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }
      if (user.is_blocked) {
        throw new Error("USER_BLOCKED");
      }
      if (user.is_verified) {
        throw new Error("USER_VERIFIED");
      }
      emailVerification(email, token);
      await this.userRepository.update({ email, is_verified: true });
      return;
    } catch (error: any) {
      console.log("catched");
      throw new Error(error.message);
    }
  }

  async verifyEmailByOtp(email: string, otp: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error("INVALID_EMAIL");
      }
      if (user.is_verified) {
        throw new Error("USER_VERIFIED");
      }
      if (user.is_blocked) {
        throw new Error("USER_BLOCKED");
      }
      const otpdata = await this.otpRepository.findOtp(email);
      if (!otpdata) {
        throw new Error("INVALID_EMAIL");
      }
      if (otp !== otpdata.otp) {
        throw new Error("INVALID");
      }
      if (Date.now() > otpdata.expiresAt.getTime()) {
        throw new Error("OTP_EXPIRED");
      }
      await this.otpRepository.delete(email);
      await this.userRepository.update({ email, is_verified: true });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async ResendOtp(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("INVALID_EMAIL");
    }
    if (user.is_verified) {
      throw new Error("USER_VERIFIED");
    }
    if (user.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    console.log("user", user);
    const otp = generateOtp();
    try {
      await sendVerificationEmail(user.email, user.user_id, otp);
      console.log("email send successfully");
    } catch (error) {
      console.log(error);
      throw new Error("MAIL_SEND_ERROR");
    }
    try {
      await this.otpRepository.storeOtp({
        email: user.email,
        otp: otp,
        expiresAt: new Date(Date.now() + 60 * 1000),
      });
    } catch (error: any) {
      throw new Error("DB_ERROR");
    }
  }
}
