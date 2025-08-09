import { SessionDocument } from "@domain/entities/SessionDocument";
import { IMapper } from "../IMapper";
import { ISessionDocumentModel } from "@infrastructure/database/model/SessionDocumentsModel";

export class SessionDocumentMapper
  implements IMapper<SessionDocument, ISessionDocumentModel>
{
  toDomain(persistence: ISessionDocumentModel): SessionDocument {
    return SessionDocument.fromPersistence({
      id: persistence._id,
      client_id: persistence.client_id,
      session_id: persistence.session_id,
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
      document: entity.documents,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
