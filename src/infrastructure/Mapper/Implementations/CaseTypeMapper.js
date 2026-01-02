"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTypeMapper = void 0;
const CaseType_1 = require("@domain/entities/CaseType");
class CaseTypeMapper {
    toDomain(persistence) {
        return CaseType_1.CaseType.fromPersistance({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            practiceareaId: persistence.practiceareaId,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            createdAt: entity.createdAt,
            name: entity.name,
            practiceareaId: entity.practiceareaId,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.CaseTypeMapper = CaseTypeMapper;
