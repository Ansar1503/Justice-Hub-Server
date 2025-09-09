import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import LawyerDocumentsModel, {
  ILawyerDocumentsModel,
} from "../model/LawyerDocumentsModel";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { lawyerDocumentsMapper } from "@infrastructure/Mapper/Implementations/LawyerDocumentMapper";

export class LawyerDocumentsRepository implements ILawyerDocumentsRepository {
  constructor(
    private mapper: IMapper<
      LawyerDocuments,
      ILawyerDocumentsModel
    > = new lawyerDocumentsMapper()
  ) {}
  async create(documents: LawyerDocuments): Promise<LawyerDocuments> {
    const createdDocument = await LawyerDocumentsModel.findOneAndUpdate(
      { _id: documents.id, user_id: documents.userId },
      {
        bar_council_certificate: documents.barCouncilCertificate,
        enrollment_certificate: documents.enrollmentCertificate,
        certificate_of_practice: documents.certificateOfPractice,
      },
      { upsert: true, new: true }
    );

    return this.mapper.toDomain(createdDocument);
  }

  async find(user_id: string): Promise<LawyerDocuments | null> {
    const data = await LawyerDocumentsModel.findOne({ user_id });
    return data ? this.mapper.toDomain(data) : null;
  }
}
