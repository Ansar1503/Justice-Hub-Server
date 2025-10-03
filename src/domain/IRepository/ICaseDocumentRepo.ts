import { CaseDocument } from "@domain/entities/SessionDocument";
import { IBaseRepository } from "./IBaseRepo";
import {
  FetchCasesDocumentsByCaseInputDto,
  FetchCasesDocumentsByCaseOutputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";

export interface ICaseDocumentsRepo extends IBaseRepository<CaseDocument> {
  findByCase(
    payload: FetchCasesDocumentsByCaseInputDto
  ): Promise<FetchCasesDocumentsByCaseOutputDto>;
}
