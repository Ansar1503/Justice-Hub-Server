import { Otp } from "@domain/entities/Otp";
import { IotpModel } from "@infrastructure/database/model/OtpModel";
import { IMapper } from "../IMapper";

export class OtpMapper implements IMapper<Otp, IotpModel> {
    toDomain(persistence: IotpModel): Otp {
        return Otp.fromPersistence({
            id: persistence._id,
            email: persistence.email,
            otp: persistence.otp,
            expiresAt: persistence.expiresAt,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IotpModel[]): Otp[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Otp): Partial<IotpModel> {
        return {
            _id: entity.id,
            email: entity.email,
            otp: entity.otp,
            expiresAt: entity.expiresAt,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
