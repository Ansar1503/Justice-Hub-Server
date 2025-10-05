import { CaseDocument } from "@domain/entities/CaseDocument";
import { IBaseRepository } from "./IBaseRepo";
import {
  FetchCasesDocumentsByCaseInputDto,
  FetchCasesDocumentsByCaseOutputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";

export interface ICaseDocumentsRepo extends IBaseRepository<CaseDocument> {
  findByCase(
    payload: FetchCasesDocumentsByCaseInputDto
  ): Promise<FetchCasesDocumentsByCaseOutputDto>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<CaseDocument | null>;
}
