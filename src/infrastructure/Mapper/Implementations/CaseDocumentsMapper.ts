import { CaseDocument } from "@domain/entities/SessionDocument";
import { IMapper } from "../IMapper";
import { ICaseDocumentModel } from "@infrastructure/database/model/CaseDocumentModel";

export class caseDocumentsMapper
implements IMapper<CaseDocument, ICaseDocumentModel>
{
    toDomain(persistence: ICaseDocumentModel): CaseDocument {
        return CaseDocument.fromPersistence({
            caseId: persistence.caseId,
            createdAt: persistence.createdAt,
            documents: persistence.document,
            id: persistence._id,
            updatedAt: persistence.updatedAt,
            clientId: persistence.clientId,
            lawyerId: persistence.lawyerId,
        });
    }
    toDomainArray(persistence: ICaseDocumentModel[]): CaseDocument[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: CaseDocument): Partial<ICaseDocumentModel> {
        return {
            _id: entity.id,
            caseId: entity.caseId,
            document: entity.documents,
            clientId: entity.clientId,
            lawyerId: entity.lawyerId,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
