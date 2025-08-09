import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IRemoveSessionDocumentsUseCase
  extends IUseCase<
    {
      documentId: string;
      sessionId: string;
    },
    UploadSessionDocumentOutPutDto | null
  > {}
