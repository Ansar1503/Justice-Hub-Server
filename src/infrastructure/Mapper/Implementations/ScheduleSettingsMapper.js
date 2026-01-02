"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleSettingsMapper = void 0;
const ScheduleSettings_1 = require("@domain/entities/ScheduleSettings");
class ScheduleSettingsMapper {
    toDomain(persistence) {
        return ScheduleSettings_1.ScheduleSettings.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            autoConfirm: persistence.autoConfirm,
            maxDaysInAdvance: persistence.maxDaysInAdvance,
            slotDuration: persistence.slotDuration,
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
            autoConfirm: entity.autoConfirm,
            maxDaysInAdvance: entity.maxDaysInAdvance,
            slotDuration: entity.slotDuration,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.ScheduleSettingsMapper = ScheduleSettingsMapper;
