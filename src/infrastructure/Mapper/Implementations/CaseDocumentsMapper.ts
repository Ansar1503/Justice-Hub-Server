import { CaseDocument } from "@domain/entities/SessionDocument";
import { ICaseDocumentModel } from "@infrastructure/database/model/CaseDocumentModel";
import { IMapper } from "../IMapper";

export class caseDocumentsMapper
  implements IMapper<CaseDocument, ICaseDocumentModel>
{
  toDomain(persistence: ICaseDocumentModel): CaseDocument {
    return CaseDocument.fromPersistence({
      caseId: persistence.caseId,
      createdAt: persistence.createdAt,
      document: persistence.document,
      id: persistence._id,
      updatedAt: persistence.updatedAt,
      uploadBy: persistence.uploadBy,
    });
  }
  toDomainArray(persistence: ICaseDocumentModel[]): CaseDocument[] {
    return persistence.map((p) => this.toDomain(p));
  }
  toPersistence(entity: CaseDocument): Partial<ICaseDocumentModel> {
    return {
      _id: entity.id,
      caseId: entity.caseId,
      document: entity.document,
      uploadBy: entity.uploadBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
