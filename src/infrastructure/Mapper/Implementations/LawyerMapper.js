"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerMapper = void 0;
const Lawyer_1 = require("@domain/entities/Lawyer");
class LawyerMapper {
    toDomain(persistence) {
        return Lawyer_1.Lawyer.fromPersistence({
            createdAt: persistence.createdAt,
            description: persistence.description,
            experience: persistence.experience,
            id: persistence._id,
            updatedAt: persistence.updatedAt,
            consultationFee: persistence.consultationFee,
            practiceAreas: persistence.practiceAreas,
            specializations: persistence.specialisations,
            userId: persistence.userId,
        });
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            userId: entity.userId,
            description: entity.description,
            experience: entity.experience,
            consultationFee: entity.consultationFee,
            practiceAreas: entity.practiceAreas,
            specialisations: entity.specializations,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
}
exports.LawyerMapper = LawyerMapper;
