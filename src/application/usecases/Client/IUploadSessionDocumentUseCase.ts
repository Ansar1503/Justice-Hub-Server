import {
    UploadSessionDocumentInputDto,
    UploadSessionDocumentOutPutDto,
} from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUploadSessionDocumentUseCase
  extends IUseCase<
    UploadSessionDocumentInputDto,
    UploadSessionDocumentOutPutDto
  > {}
