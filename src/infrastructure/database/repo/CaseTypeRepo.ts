import { CaseType } from "@domain/entities/CaseType";
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
  async findById(id: string): Promise<CaseType | null> {
    const data = await this.model.findOne({ _id: id });
    return data ? this.mapper.toDomain(data) : null;
  }
  async findByName(name: string): Promise<CaseType | null> {
    const data = await this.model.findOne({ name });
    return data ? this.mapper.toDomain(data) : null;
  }
}
