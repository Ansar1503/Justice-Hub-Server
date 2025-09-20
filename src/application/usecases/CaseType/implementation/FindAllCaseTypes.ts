import { CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IFindAllCaseTypes } from "../IFindAllCaseTypes";
import { ICasetype } from "@domain/IRepository/ICasetype";

export class FindAllCaseTypesUseCase implements IFindAllCaseTypes {
  constructor(private _caseTypeRepo: ICasetype) {}
  async execute(): Promise<CaseTypeDto[] | []> {
    const caseTypes = await this._caseTypeRepo.findAll();
    if (!caseTypes) return [];
    return caseTypes.map((c) => ({
      createdAt: c.createdAt,
      id: c.id,
      name: c.name,
      practiceareaId: c.practiceareaId,
      updatedAt: c.updatedAt,
    }));
  }
}
