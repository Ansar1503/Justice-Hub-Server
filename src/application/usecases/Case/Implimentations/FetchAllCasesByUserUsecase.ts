import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IFetchAllCasesByUserUsecase } from "../Interfaces/IFetchAllCasesByUserUsecase";
import { CaseDto } from "@src/application/dtos/Cases/CasesDto";

export class FetchAllCasesByUserUsecase implements IFetchAllCasesByUserUsecase {
  constructor(private _caseRepo: ICaseRepo) {}
  async execute(input: string): Promise<CaseDto[] | []> {
    const cases = await this._caseRepo.findAllByUser(input);
    return cases.map((c) => ({
      caseType: c.caseType,
      clientId: c.clientId,
      createdAt: c.createdAt,
      id: c.id,
      lawyerId: c.lawyerId,
      status: c.status,
      title: c.title,
      updatedAt: c.updatedAt,
      estimatedValue: c.estimatedValue,
      nextHearing: c.nextHearing,
      summary: c.summary,
    }));
  }
}
