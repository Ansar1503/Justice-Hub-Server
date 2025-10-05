import {
  FetchCasesDocumentsByCaseInputDto,
  FetchCasesDocumentsByCaseOutputDto,
} from "@src/application/dtos/CaseDocuments/CaseDocumentDto";
import { IFindCaseDocumentsByCaseUsecase } from "../IFindCaseDocumentsByCase";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { ICaseDocumentsRepo } from "@domain/IRepository/ICaseDocumentRepo";

export class FindCaseDocumentsByCaseUsecase
  implements IFindCaseDocumentsByCaseUsecase
{
  constructor(
    private _caseRepo: ICaseRepo,
    private _caseDocumentRepo: ICaseDocumentsRepo
  ) {}
  async execute(
    input: FetchCasesDocumentsByCaseInputDto
  ): Promise<FetchCasesDocumentsByCaseOutputDto> {
    const caseExists = await this._caseRepo.findById(input.caseId);
    if (!caseExists) throw new Error("no case has been found");
    const data = await this._caseDocumentRepo.findByCase(input);
    return data;
  }
}
