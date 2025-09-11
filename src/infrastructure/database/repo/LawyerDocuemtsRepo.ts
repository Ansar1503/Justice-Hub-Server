import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import LawyerDocumentsModel, {
  ILawyerDocumentsModel,
} from "../model/LawyerDocumentsModel";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { lawyerDocumentsMapper } from "@infrastructure/Mapper/Implementations/LawyerDocumentMapper";
import { ClientSession } from "mongoose";

export class LawyerDocumentsRepository implements ILawyerDocumentsRepository {
  constructor(
    private mapper: IMapper<
      LawyerDocuments,
      ILawyerDocumentsModel
    > = new lawyerDocumentsMapper(),
    private _session?: ClientSession
  ) {}
  async create(documents: LawyerDocuments): Promise<LawyerDocuments> {
    const createdDocument = await LawyerDocumentsModel.findOneAndUpdate(
      { _id: documents.id, userId: documents.userId },
      {
        barCouncilCertificate: documents.barCouncilCertificate,
        enrollmentCertificate: documents.enrollmentCertificate,
        certificateOfPractice: documents.certificateOfPractice,
      },
      { upsert: true, new: true, session: this._session }
    );

    return this.mapper.toDomain(createdDocument);
  }

  async find(user_id: string): Promise<LawyerDocuments | null> {
    const data = await LawyerDocumentsModel.findOne(
      { userId: user_id },
      {},
      { session: this._session }
    );
    return data ? this.mapper.toDomain(data) : null;
  }
}
