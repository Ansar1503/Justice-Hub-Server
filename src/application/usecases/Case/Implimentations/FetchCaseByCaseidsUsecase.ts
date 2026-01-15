import { CaseDto } from "@src/application/dtos/Cases/CasesDto";
import { IFetchCaseByCaseTypeIdsUsecase } from "../Interfaces/IFetchCaseByCaseidsUsecase";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";

export class FetchCaseByCaseidsUsecase
  implements IFetchCaseByCaseTypeIdsUsecase
{
  constructor(private _caseRepo: ICaseRepo) {}
  async execute(input: {
    lawyerId: string;
    userId: string;
    caseTypeIds: string[];
  }): Promise<CaseDto[]> {
    const data = await this._caseRepo.findByCaseTypes(input);
    if (data.length == 0) {
      throw new Error("no data found");
    }
    return data.map((d) => ({
      caseType: d.caseType,
      clientId: d.clientId,
      createdAt: d.createdAt,
      id: d.id,
      lawyerId: d.lawyerId,
      status: d.status,
      title: d.title,
      updatedAt: d.updatedAt,
      estimatedValue: d.estimatedValue,
      nextHearing: d.nextHearing,
      summary: d.summary,
    }));
  }
}
