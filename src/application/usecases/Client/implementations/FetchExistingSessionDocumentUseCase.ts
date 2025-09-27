import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { ISessionDocumentRepo } from "@domain/IRepository/ISessionDocumentsRepo";
import { IFetchExistingSessionDocumentsUseCase } from "../IFetchExistingSessionDocumentUseCase";

export class FetchExistingSessionDocumentUseCase implements IFetchExistingSessionDocumentsUseCase {
    constructor(private sessionDocumentRepo: ISessionDocumentRepo) {}
    async execute(input: string): Promise<UploadSessionDocumentOutPutDto | null> {
        const documents = await this.sessionDocumentRepo.findBySessionId({
            session_id: input,
        });
        if (!documents) return null;
        return {
            client_id: documents.clientId,
            createdAt: documents.createdAt,
            document: documents.documents,
            caseId: documents.caseId,
            id: documents.id,
            session_id: documents.sessionId,
            updatedAt: documents.updatedAt,
        };
    }
}
