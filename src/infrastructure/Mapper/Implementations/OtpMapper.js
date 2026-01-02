"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpMapper = void 0;
const Otp_1 = require("@domain/entities/Otp");
class OtpMapper {
    toDomain(persistence) {
        return Otp_1.Otp.fromPersistence({
            id: persistence._id,
            email: persistence.email,
            otp: persistence.otp,
            expiresAt: persistence.expiresAt,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
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
exports.OtpMapper = OtpMapper;
