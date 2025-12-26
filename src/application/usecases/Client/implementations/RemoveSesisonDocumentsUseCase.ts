import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { ISessionDocumentRepo } from "@domain/IRepository/ISessionDocumentsRepo";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

import { ICloudinaryService } from "@src/application/services/Interfaces/ICloudinaryService";
import { IRemoveSessionDocumentsUseCase } from "../IRemoveSessionDocumentsUseCase";

export class RemoveSessionDocumentsUseCase implements IRemoveSessionDocumentsUseCase {
    constructor(
        private _sessionDocumentsRepo: ISessionDocumentRepo,
        private _cloudinaryService: ICloudinaryService,
    ) {}
    async execute(input: { documentId: string; sessionId: string }): Promise<UploadSessionDocumentOutPutDto | null> {
        const existingDoc = await this._sessionDocumentsRepo.findBySessionId({
            session_id: input.sessionId,
        });
        if (!existingDoc) {
            throw new ValidationError("Session not found");
        }

        const urltoDelete = existingDoc?.documents?.filter((doc) => doc?._id == input.documentId)[0].url;

        this._cloudinaryService.deleteFile(urltoDelete);

        const deleted = await this._sessionDocumentsRepo.removeOne(input.documentId);
        // console.log("deleted", deleted);r
        if (!deleted?.documents?.length) {
            // console.log("working....");
            await this._sessionDocumentsRepo.removeAll(deleted?.id || "");
            return null;
        }
        return {
            caseId: deleted.caseId,
            client_id: deleted.clientId,
            createdAt: deleted.createdAt,
            document: deleted.documents,
            id: deleted.id,
            session_id: deleted.sessionId,
            updatedAt: deleted.updatedAt,
        };
    }
}
