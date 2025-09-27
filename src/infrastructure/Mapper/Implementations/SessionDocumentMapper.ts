import { SessionDocument } from "@domain/entities/SessionDocument";
import { ISessionDocumentModel } from "@infrastructure/database/model/SessionDocumentsModel";
import { IMapper } from "../IMapper";

export class SessionDocumentMapper implements IMapper<SessionDocument, ISessionDocumentModel> {
    toDomain(persistence: ISessionDocumentModel): SessionDocument {
        return SessionDocument.fromPersistence({
            id: persistence._id,
            client_id: persistence.client_id,
            session_id: persistence.session_id,
            caseId: persistence.caseId,
            document: persistence.document,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: ISessionDocumentModel[]): SessionDocument[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: SessionDocument): Partial<ISessionDocumentModel> {
        return {
            _id: entity.id,
            client_id: entity.clientId,
            session_id: entity.sessionId,
            caseId: entity.caseId,
            document: entity.documents,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
