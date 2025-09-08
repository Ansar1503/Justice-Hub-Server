import { CaseType } from "@domain/entities/Casetype";
import { BaseRepository } from "./base/BaseRepo";
import { CasetypeModel, ICasetypeModel } from "../model/CaseTypeModel";
import { ICasetype } from "@domain/IRepository/ICasetype";
import { IMapper } from "@infrastructure/Mapper/IMapper";

export class CaseTypeRepo
  extends BaseRepository<CaseType, ICasetypeModel>
  implements ICasetype
{
  constructor(mapper: IMapper<CaseType, ICasetypeModel>) {
    super(CasetypeModel, mapper);
  }
}
