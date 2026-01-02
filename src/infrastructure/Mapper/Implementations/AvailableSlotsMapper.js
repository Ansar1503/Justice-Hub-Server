"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableSlotsMapper = void 0;
const Availability_1 = require("@domain/entities/Availability");
class AvailableSlotsMapper {
    toDomain(persistence) {
        return Availability_1.Availability.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            monday: persistence.monday,
            tuesday: persistence.tuesday,
            wednesday: persistence.wednesday,
            thursday: persistence.thursday,
            friday: persistence.friday,
            saturday: persistence.saturday,
            sunday: persistence.sunday,
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
            lawyer_id: entity.lawyer_id,
            monday: entity.getDayAvailability("monday"),
            tuesday: entity.getDayAvailability("tuesday"),
            wednesday: entity.getDayAvailability("wednesday"),
            thursday: entity.getDayAvailability("thursday"),
            friday: entity.getDayAvailability("friday"),
            saturday: entity.getDayAvailability("saturday"),
            sunday: entity.getDayAvailability("sunday"),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.AvailableSlotsMapper = AvailableSlotsMapper;
