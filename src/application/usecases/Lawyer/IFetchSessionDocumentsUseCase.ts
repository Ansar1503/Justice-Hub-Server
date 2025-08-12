import { FindSessionDocumentOutputDto } from "@src/application/dtos/Lawyer/FindSessionDocumentDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchSessionDocumentsUseCase
  extends IUseCase<string, FindSessionDocumentOutputDto> {}
