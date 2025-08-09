// import { JwtPayload } from "jsonwebtoken";
// import {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyRefreshToken,
// } from "../services/jwt.service";
// import { ResposeUserDto } from "../dtos/user.dto";
// import { User } from "../../domain/entities/User";
// import bcrypt from "bcryptjs";
// import {
//   emailVerification,
//   sendVerificationEmail,
// } from "../services/email.service";
// import { Client } from "../../domain/entities/Client";
// import { IUserRepository } from "../../domain/IRepository/IUserRepo";
// import { IClientRepository } from "../../domain/IRepository/IClientRepo";
// import { IotpRepository } from "../../domain/IRepository/IOtpRepo";
// import { ILawyerRepository } from "../../domain/IRepository/ILawyerRepo";
// import { verifyAuthCode } from "../services/google.service";
// import { Lawyer } from "@domain/entities/Lawyer";

// export class UserUseCase {
//   constructor(
    // private userRepository: IUserRepository,
    // private otpRepo: IotpRepository,
    // private clientRepo: IClientRepository,
    // private lawyerRepo: ILawyerRepository
  // ) {}

  // private async createClient(clientData: Client) {
  //   return await this.clientRepo.create(clientData);
  // }

  // async createUser(userData: User): Promise<ResposeUserDto> {
  //   const existingUser = await this.userRepository.findByEmail(userData.email);
  //   if (existingUser) {
  //     throw new Error("USER_EXISTS");
  //   }

  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   const newUser = User.create(userData);
  //   newUser.changePassword(hashedPassword);
  //   try {
  //     const user = await this.userRepository.create(newUser);
  //     const client = Client.create({
  //       user_id: user.user_id,
  //       profile_image: "",
  //       address: "",
  //       dob: "",
  //       gender: "",
  //     });
  //     await this.createClient(client);
  //     if (userData.role === "lawyer") {
  //       const lawyerData = Lawyer.create({
  //         barcouncil_number: "",
  //         certificate_of_practice_number: "",
  //         consultation_fee: 0,
  //         description: "",
  //         documents: "",
  //         enrollment_certificate_number: "",
  //         experience: 0,
  //         practice_areas: [],
  //         rejectReason: "",
  //         specialisation: [],
  //       });
  //       await this.lawyerRepo.create(lawyerData);
  //     }

  //     const otp = await generateOtp();
  //     try {
  //       await sendVerificationEmail(user.email, user.user_id, otp);
  //       console.log("email send successfully", otp);
  //     } catch (error) {
  //       console.log(error);
  //       throw new Error("MAIL_SEND_ERROR");
  //     }
  //     await this.otpRepo.storeOtp({
  //       email: user.email,
  //       otp: otp,
  //       expiresAt: new Date(Date.now() + 60 * 1000),
  //     });
  //     return new ResposeUserDto(user);
  //   } catch (error: any) {
  //     console.log("error creating user0", error);
  //     if (error.message === "MAIL_SEND_ERROR") {
  //       throw new Error(error.message);
  //     }
  //     throw new Error("DB_ERROR");
  //   }
  // }

  // async userLogin({
  //   email,
  //   password,
  // }: {
  //   email: string;
  //   password: string;
  // }): Promise<{
  //   user: ResposeUserDto;
  //   accesstoken: string;
  //   refreshtoken: string;
  // }> {
  //   let user;
  //   try {
  //     user = await this.userRepository.findByEmail(email);
  //   } catch (error) {
  //     throw new Error("DB_ERROR");
  //   }
  //   if (!user) throw new Error("USER_NOT_FOUND");

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) throw new Error("INVALID_PASSWORD");

  //   if (user.is_blocked) throw new Error("USER_BLOCKED");

  //   const accesstoken = generateAccessToken({
  //     id: user.user_id,
  //     email: user.email,
  //     role: user.role,
  //     status: user.is_blocked as boolean,
  //   });

  //   const refreshtoken = generateRefreshToken({
  //     id: user.user_id,
  //     email: user.email,
  //     role: user.role,
  //     status: user.is_blocked as boolean,
  //   });

  //   return { user: new ResposeUserDto(user), accesstoken, refreshtoken };
  // }

  // userReAuth(token: string): string {
  //   const userpayload = verifyRefreshToken(token) as JwtPayload;
  //   const accesstoken = generateAccessToken({
  //     email: userpayload.email,
  //     id: userpayload.id,
  //     role: userpayload.role,
  //     status: userpayload.status,
  //   });

  //   return accesstoken;
  // }

  // async verifyEmail(email: string, token: string) {
  //   try {
  //     const user = await this.userRepository.findByEmail(email);
  //     if (!user) {
  //       console.log("user not found", user);
  //       throw new Error("USER_NOT_FOUND");
  //     }
  //     if (user.is_blocked) {
  //       throw new Error("USER_BLOCKED");
  //     }
  //     if (user.is_verified) {
  //       throw new Error("USER_VERIFIED");
  //     }
  //     emailVerification(token);
  //     await this.userRepository.update({ email, is_verified: true });
  //     await this.otpRepo.delete(email);
  //   } catch (error: any) {
  //     console.log("catched");
  //     throw new Error(error.message);
  //   }
  // }

  // async verifyEmailByOtp(email: string, otp: string) {
  //   try {
  //     const user = await this.userRepository.findByEmail(email);
  //     if (!user) {
  //       throw new Error("INVALID_EMAIL");
  //     }
  //     if (user.is_verified) {
  //       throw new Error("USER_VERIFIED");
  //     }
  //     if (user.is_blocked) {
  //       throw new Error("USER_BLOCKED");
  //     }
  //     const otpdata = await this.otpRepo.findOtp(email);
  //     if (!otpdata || otp !== otpdata.otp) {
  //       throw new Error("INVALID");
  //     }
  //     if (Date.now() > otpdata.expiresAt.getTime()) {
  //       throw new Error("OTP_EXPIRED");
  //     }
  //     await this.otpRepo.delete(email);
  //     await this.userRepository.update({ email, is_verified: true });
  //   } catch (error: any) {
  //     throw new Error(error.message);
  //   }
  // }

  // async ResendOtp(email: string) {
  //   const user = await this.userRepository.findByEmail(email);
  //   if (!user) {
  //     throw new Error("INVALID_EMAIL");
  //   }
  //   if (user.is_verified) {
  //     throw new Error("USER_VERIFIED");
  //   }
  //   if (user.is_blocked) {
  //     throw new Error("USER_BLOCKED");
  //   }
  //   console.log("user", user);
  //   const otp = generateOtp();
  //   try {
  //     await sendVerificationEmail(user.email, user.user_id, otp);
  //     console.log("email send successfully");
  //   } catch (error: any) {
  //     console.log(error.message);
  //     throw new Error("MAIL_SEND_ERROR");
  //   }
  //   try {
  //     await this.otpRepo.storeOtp({
  //       email: user.email,
  //       otp: otp,
  //       expiresAt: new Date(Date.now() + 60 * 1000),
  //     });
  //   } catch (error: any) {
  //     throw new Error("DB_ERROR");
  //   }
  // }
  // async GoogleSign(payload: { code: string; role: "lawyer" | "client" }) {
  //   const googleResponse = await verifyAuthCode(payload.code);
  //   console.log("gooe", googleResponse);
  //   if (!googleResponse) {
  //     throw new Error("INVALID_TOKEN");
  //   }
  //   const userDetails = await this.userRepository.findByEmail(
  //     googleResponse.email || ""
  //   );
  //   if (userDetails) {
  //     throw new Error("USER_EXIST");
  //   }
  //   // const newUser = await this.userRepository.create({
  //   //   email: googleResponse.email || "",
  //   //   name: googleResponse.name || "",
  //   //   role:payload.role,
  //   //   is_verified:true,
  //   //   password:"",

  //   // });
  // }
// }
