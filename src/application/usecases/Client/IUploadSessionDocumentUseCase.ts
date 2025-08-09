import {
  UploadSessionDocumentInputDto,
  UploadSessionDocumentOutPutDto,
} from "@src/application/dtos/client/UploadSessionDocuemtDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IUploadSessionDocumentUseCase
  extends IUseCase<
    UploadSessionDocumentInputDto,
    UploadSessionDocumentOutPutDto
  > {}
