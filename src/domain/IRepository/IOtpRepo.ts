import { Otp } from "../entities/Otp";

export interface IOtpRepository {
  storeOtp(otp: Otp): Promise<void>;
  findOtp(email: string): Promise<Otp | null>;
  delete(email:string):Promise<void>;
}
