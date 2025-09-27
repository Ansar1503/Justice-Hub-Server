import { FindSessionDocumentOutputDto } from "@src/application/dtos/Lawyer/FindSessionDocumentDto";
import { IFetchSessionDocumentsUseCase } from "../IFetchSessionDocumentsUseCase";
import { ISessionDocumentRepo } from "@domain/IRepository/ISessionDocumentsRepo";

export class FetchSessionsDocumentsUseCase
implements IFetchSessionDocumentsUseCase
{
    constructor(private sessionDocumentsRepo: ISessionDocumentRepo) {}
    async execute(input: string): Promise<FindSessionDocumentOutputDto> {
        const result = await this.sessionDocumentsRepo.findBySessionId({
            session_id: input,
        });
        if (!result) throw new Error("session docuemt not found");
        return {
            caseId: result.caseId,
            client_id: result.clientId,
            createdAt: result.createdAt,
            document: result.documents,
            id: result.id,
            session_id: result.sessionId,
            updatedAt: result.updatedAt,
        };
    }
}
