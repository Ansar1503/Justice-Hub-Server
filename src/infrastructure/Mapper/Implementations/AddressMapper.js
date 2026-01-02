"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressMapper = void 0;
const Address_1 = require("@domain/entities/Address");
class AddressMapper {
    toDomain(persistence) {
        return Address_1.Address.fromPersistence({
            city: persistence.city,
            createdAt: persistence.createdAt,
            id: persistence._id.toString(),
            locality: persistence.locality,
            pincode: persistence.pincode,
            state: persistence.state,
            updatedAt: persistence.updatedAt,
            user_id: persistence.user_id,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            city: entity.city,
            locality: entity.locality,
            state: entity.state,
            pincode: entity.pincode,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.AddressMapper = AddressMapper;
