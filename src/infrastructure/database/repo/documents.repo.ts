import { timeStamp } from "console";
import { LawyerDocuments } from "../../../domain/entities/Lawyer";
import { IDocumentsRepository } from "../../../domain/IRepository/I_documents.repo";
import LawyerDocumentsModel from "../model/lawyerdocuments.model";

export class DocumentsRepo implements IDocumentsRepository {
  async create(
    documents: LawyerDocuments
  ): Promise<(LawyerDocuments & { _id: string }) | null> {
    const createdDocument = await LawyerDocumentsModel.findOneAndUpdate(
      { user_id: documents.user_id },
      {
        bar_council_certificate: documents.bar_council_certificate,
        enrollment_certificate: documents.enrollment_certificate,
        certificate_of_practice: documents.certificate_of_practice,
      },
      { upsert: true, new: true }
    );

    return createdDocument as (LawyerDocuments & { _id: string }) | null;
  }

  async find(query: {
    user_id: string;
    email: string;
  }): Promise<LawyerDocuments & { _id: string } | null> {
    return await LawyerDocumentsModel.findOne(query)
  }
}
