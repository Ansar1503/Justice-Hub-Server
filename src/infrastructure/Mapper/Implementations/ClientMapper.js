"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMapper = void 0;
const Client_1 = require("@domain/entities/Client");
class ClientMapper {
    toDomain(persistence) {
        return Client_1.Client.fromPersistance({
            id: persistence._id,
            user_id: persistence.user_id,
            profile_image: persistence.profile_image,
            gender: persistence.gender,
            dob: persistence.dob,
            address: persistence.address.toString(),
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
            user_id: entity.user_id,
            profile_image: entity.profile_image,
            gender: entity.gender,
            dob: entity.dob,
            address: entity.address,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ClientMapper = ClientMapper;
