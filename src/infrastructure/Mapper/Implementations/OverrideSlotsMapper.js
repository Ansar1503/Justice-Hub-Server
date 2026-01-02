"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverrideSlotsMapper = void 0;
const Override_1 = require("@domain/entities/Override");
class OverrideSlotsMapper {
    toDomain(persistence) {
        return Override_1.Override.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            overrideDates: persistence.overrideDates,
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
            lawyer_id: entity.lawyerId,
            overrideDates: entity.overrideDates,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.OverrideSlotsMapper = OverrideSlotsMapper;
