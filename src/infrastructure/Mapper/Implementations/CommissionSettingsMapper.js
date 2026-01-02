"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSettingsMapper = void 0;
const CommissionSettings_1 = require("@domain/entities/CommissionSettings");
class CommissionSettingsMapper {
    toDomain(persistence) {
        return CommissionSettings_1.CommissionSettings.fromPersistence({
            id: persistence._id,
            initialCommission: persistence.initialCommission,
            followupCommission: persistence.followupCommission,
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
            initialCommission: entity.initialCommission,
            followupCommission: entity.followupCommission,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.CommissionSettingsMapper = CommissionSettingsMapper;
