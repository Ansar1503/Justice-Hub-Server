import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import LawyerDocumentsModel, {
  IlawyerDocumentsModel,
} from "../model/LawyerDocumentsModel";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { lawyerDocumentsMapper } from "@infrastructure/Mapper/Implementations/LawyerDocumentMapper";

export class LawyerDocumentsRepository implements ILawyerDocumentsRepository {
  constructor(
    private mapper: IMapper<
      LawyerDocuments,
      IlawyerDocumentsModel
    > = new lawyerDocumentsMapper()
  ) {}
  async create(documents: LawyerDocuments): Promise<LawyerDocuments> {
    const createdDocument = await LawyerDocumentsModel.findOneAndUpdate(
      { _id: documents.id, user_id: documents.user_id },
      {
        bar_council_certificate: documents.bar_council_certificate,
        enrollment_certificate: documents.enrollment_certificate,
        certificate_of_practice: documents.certificate_of_practice,
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
