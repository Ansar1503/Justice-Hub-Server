"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lawyerDocumentsMapper = void 0;
const LawyerDocument_1 = require("@domain/entities/LawyerDocument");
class lawyerDocumentsMapper {
    toDomain(persistence) {
        return LawyerDocument_1.LawyerDocuments.fromPersistence({
            id: persistence._id,
            userId: persistence.userId,
            barCouncilCertificate: persistence.barCouncilCertificate,
            certificateOfPractice: persistence.certificateOfPractice,
            enrollmentCertificate: persistence.enrollmentCertificate,
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
            userId: entity.userId,
            barCouncilCertificate: entity.barCouncilCertificate,
            certificateOfPractice: entity.certificateOfPractice,
            enrollmentCertificate: entity.enrollmentCertificate,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
exports.lawyerDocumentsMapper = lawyerDocumentsMapper;
