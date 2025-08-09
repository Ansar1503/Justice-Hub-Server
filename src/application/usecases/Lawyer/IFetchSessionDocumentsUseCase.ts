import { FindSessionDocumentOutputDto } from "@src/application/dtos/Lawyer/FindSessionDocumentDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IFetchSessionDocumentsUseCase
  extends IUseCase<string, FindSessionDocumentOutputDto> {}
