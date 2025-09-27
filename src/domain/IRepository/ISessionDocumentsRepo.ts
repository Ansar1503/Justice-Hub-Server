import { SessionDocument } from "@domain/entities/SessionDocument";

export interface ISessionDocumentRepo {
    create(payload: SessionDocument): Promise<SessionDocument>;
    findBySessionId(payload: { session_id: string }): Promise<SessionDocument | null>;
    removeOne(documentId: string): Promise<SessionDocument | null>;
    removeAll(id: string): Promise<void>;
}
