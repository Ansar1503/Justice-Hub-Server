import {
    CaseDocumentDto,
    UploadDocumentInputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface UploadCaseDocuments
  extends IUseCase<UploadDocumentInputDto, CaseDocumentDto> {}
