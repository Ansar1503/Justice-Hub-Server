import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Otp } from "../../../domain/entities/Otp";
import { IOtpRepository } from "../../../domain/IRepository/IOtpRepo";
import otpModel, { IotpModel } from "../model/OtpModel";
import { OtpMapper } from "@infrastructure/Mapper/Implementations/OtpMapper";
import { ClientSession } from "mongoose";

export class OtpRepository implements IOtpRepository {
    constructor(
    private mapper: IMapper<Otp, IotpModel> = new OtpMapper(),
    private readonly _session?: ClientSession
    ) {}

    async storeOtp(otp: Otp): Promise<void> {
        await otpModel.findOneAndUpdate(
            { email: otp.email },
            { otp: otp.otp, expiresAt: otp.expiresAt },
            { upsert: true, new: true, session: this._session }
        );
    }
    async findOtp(email: string): Promise<Otp | null> {
        const data = await otpModel.findOne({ email });
        return data ? this.mapper.toDomain(data) : null;
    }
    async delete(email: string): Promise<void> {
        await otpModel.deleteOne({ email });
    }
}
