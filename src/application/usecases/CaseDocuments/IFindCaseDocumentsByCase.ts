import {
  FetchCasesDocumentsByCaseInputDto,
  FetchCasesDocumentsByCaseOutputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFindCaseDocumentsByCaseUsecase
  extends IUseCase<
    FetchCasesDocumentsByCaseInputDto,
    FetchCasesDocumentsByCaseOutputDto
  > {}
