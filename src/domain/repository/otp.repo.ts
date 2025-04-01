import { Otp } from "../entities/Otp.entity";

export interface IotpRepository {
  storeOtp(otp: Otp): Promise<void>;
  findOtp(email: string): Promise<Otp | null>;
  delete(email:string):Promise<void>;
}
