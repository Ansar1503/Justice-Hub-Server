import { Otp } from "../../../domain/entities/Otp.entity";
import { IotpRepository } from "../../../domain/repository/otp.repo";
import otpModel, { IotpModel } from "../model/otp.model";

export class OtpRepository implements IotpRepository {
  async storeOtp(otp: Otp): Promise<void> {
    await otpModel.findOneAndUpdate(
      { email: otp.email },
      { otp: otp.otp, expiresAt: otp.expiresAt },
      { upsert: true }
    );
  }
  async findOtp(email: string): Promise<IotpModel | null> {
    return await otpModel.findOne({ email });
  }
  async delete(email: string): Promise<void> {
    await otpModel.deleteOne({ email });
  }
}
