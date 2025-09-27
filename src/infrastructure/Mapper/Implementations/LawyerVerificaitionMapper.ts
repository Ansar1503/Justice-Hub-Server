import { LawyerVerification } from "@domain/entities/LawyerVerification";
import { ILawyerVerificationModel } from "@infrastructure/database/model/LawyerVerificaitionModel";
import { IMapper } from "../IMapper";

export class LawyerVerificationMapper implements IMapper<LawyerVerification, ILawyerVerificationModel> {
    toDomain(persistence: ILawyerVerificationModel): LawyerVerification {
        return LawyerVerification.fromPersistence({
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

    toPersistence(entity: LawyerVerification): Partial<ILawyerVerificationModel> {
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

    toDomainArray(persistence: ILawyerVerificationModel[]): LawyerVerification[] {
        return persistence.map((p) => this.toDomain(p));
    }
}
