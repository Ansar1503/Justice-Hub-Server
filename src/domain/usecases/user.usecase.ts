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

export class UserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
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
      const otp = await generateOtp();
      try {
        await sendVerificationEmail(user.email, user.user_id, otp);
        console.log("email send successfully");
      } catch (error) {
        console.log(error);
        throw new Error("MAIL_SEND_ERROR");
      }
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
      emailVerification(email, token);
      user.is_verified = true;
      await user.save();
      return;
    } catch (error:any) {
      console.log('catched')
      throw new Error(error.message)
    }
  }
}
