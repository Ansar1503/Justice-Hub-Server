import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "../IMapper";
import { IlawyerDocumentsModel } from "@infrastructure/database/model/LawyerDocumentsModel";

export class lawyerDocumentsMapper
  implements IMapper<LawyerDocuments, IlawyerDocumentsModel>
{
  toDomain(persistence: IlawyerDocumentsModel): LawyerDocuments {
    return LawyerDocuments.fromPersistence({
      id: persistence._id,
      user_id: persistence.user_id,
      bar_council_certificate: persistence.bar_council_certificate,
      certificate_of_practice: persistence.certificate_of_practice,
      enrollment_certificate: persistence.enrollment_certificate,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }
  toDomainArray(persistence: IlawyerDocumentsModel[]): LawyerDocuments[] {
    return persistence.map((p) => this.toDomain(p));
  }
  toPersistence(entity: LawyerDocuments): Partial<IlawyerDocumentsModel> {
    return {
      _id: entity.id,
      user_id: entity.user_id,
      bar_council_certificate: entity.bar_council_certificate,
      certificate_of_practice: entity.certificate_of_practice,
      enrollment_certificate: entity.enrollment_certificate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
