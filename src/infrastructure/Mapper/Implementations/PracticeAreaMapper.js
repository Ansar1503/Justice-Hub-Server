"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeAreaMapper = void 0;
const PracticeArea_1 = require("@domain/entities/PracticeArea");
class PracticeAreaMapper {
    toDomain(persistence) {
        return PracticeArea_1.PracticeArea.fromPersisted({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            specializationId: persistence.specializationId,
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
            specializationId: entity.specializationId,
            createdAt: entity.createdAt,
            updatedAt: entity.udpatedAt,
        };
    }
}
exports.PracticeAreaMapper = PracticeAreaMapper;
