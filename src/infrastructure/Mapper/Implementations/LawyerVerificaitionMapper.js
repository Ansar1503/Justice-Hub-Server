"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LawyerVerificationMapper = void 0;
const LawyerVerification_1 = require("@domain/entities/LawyerVerification");
class LawyerVerificationMapper {
    toDomain(persistence) {
        return LawyerVerification_1.LawyerVerification.fromPersistence({
            id: persistence._id,
            userId: persistence.userId,
            barCouncilNumber: persistence.barCouncilNumber,
            enrollmentCertificateNumber: persistence.enrollmentCertificateNumber,
            certificateOfPracticeNumber: persistence.certificateOfPracticeNumber,
            verificationStatus: persistence.verificationStatus,
            rejectReason: persistence.rejectReason,
            documents: persistence.documents,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toPersistence(entity) {
        return {
            _id: entity.id,
            userId: entity.userId,
            barCouncilNumber: entity.barCouncilNumber,
            enrollmentCertificateNumber: entity.enrollmentCertificateNumber,
            certificateOfPracticeNumber: entity.certificateOfPracticeNumber,
            verificationStatus: entity.verificationStatus,
            rejectReason: entity.rejectReason,
            documents: entity.documents,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
    toDomainArray(persistence) {
        return persistence.map((p) => this.toDomain(p));
    }
}
exports.LawyerVerificationMapper = LawyerVerificationMapper;
