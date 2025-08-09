import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchExistingSessionDocumentsUseCase
  extends IUseCase<string, UploadSessionDocumentOutPutDto | null> {}
