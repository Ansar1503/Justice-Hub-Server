import { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/database/repo/user.repo";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../services/jwt.service";
import { ResposeUserDto } from "../dtos/user.dto";
import { User } from "../../domain/entities/User.entity";
import bcrypt from "bcryptjs";
import {
  emailVerification,
  sendVerificationEmail,
} from "../services/email.service";
import { generateOtp } from "../services/otp.service";
import { ClientRepository } from "../../infrastructure/database/repo/client.repo";
import { Client } from "../../domain/entities/Client.entity";
import { OtpRepository } from "../../infrastructure/database/repo/otp.repo";
import { IUserRepository } from "../../domain/repository/user.repo";
import { IClientRepository } from "../../domain/repository/client.repo";
import { IotpRepository } from "../../domain/repository/otp.repo";

export class UserUseCase {
  private userRepository: IUserRepository;
  private clientRepository: IClientRepository;
  private otpRepository: IotpRepository;

  constructor(
    userRepository: IUserRepository,
    otpRepo: IotpRepository,
    clientRepo: IClientRepository
  ) {
    this.userRepository = userRepository;
    this.otpRepository = otpRepo;
    this.clientRepository = clientRepo;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async createClient(clientData: Client) {
    return await this.clientRepository.create(clientData);
  }

  async createUser(userData: User): Promise<ResposeUserDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("USER_EXISTS");
    }
    userData.password = await this.hashPassword(userData.password);
    try {
      const user = await this.userRepository.create(userData);
      await this.createClient({ user_id: user.user_id });
      const otp = await generateOtp();
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
      await this.otpRepository.delete(email);
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
      if (!otpdata || otp !== otpdata.otp) {
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
    } catch (error: any) {
      console.log(error.message);
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
