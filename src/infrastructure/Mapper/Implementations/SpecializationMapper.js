"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecializationMapper = void 0;
const Specialization_1 = require("@domain/entities/Specialization");
class SpecializationMapper {
    toDomain(persistence) {
        return Specialization_1.Specialization.fromPersisted({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            name: entity.name,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.SpecializationMapper = SpecializationMapper;
