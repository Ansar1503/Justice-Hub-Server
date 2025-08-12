import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IRemoveSessionDocumentsUseCase
  extends IUseCase<
    {
      documentId: string;
      sessionId: string;
    },
    UploadSessionDocumentOutPutDto | null
  > {}
