import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "../IMapper";
import { ILawyerDocumentsModel } from "@infrastructure/database/model/LawyerDocumentsModel";

export class lawyerDocumentsMapper
  implements IMapper<LawyerDocuments, ILawyerDocumentsModel>
{
  toDomain(persistence: ILawyerDocumentsModel): LawyerDocuments {
    return LawyerDocuments.fromPersistence({
      id: persistence._id,
      userId: persistence.userId,
      barCouncilCertificate: persistence.barCouncilCertificate,
      certificateOfPractice: persistence.certificateOfPractice,
      enrollmentCertificate: persistence.enrollmentCertificate,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }
  toDomainArray(persistence: ILawyerDocumentsModel[]): LawyerDocuments[] {
    return persistence.map((p) => this.toDomain(p));
  }
  toPersistence(entity: LawyerDocuments): Partial<ILawyerDocumentsModel> {
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
