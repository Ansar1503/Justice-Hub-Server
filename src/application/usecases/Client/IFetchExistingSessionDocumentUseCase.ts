import { UploadSessionDocumentOutPutDto } from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchExistingSessionDocumentsUseCase
  extends IUseCase<string, UploadSessionDocumentOutPutDto | null> {}
