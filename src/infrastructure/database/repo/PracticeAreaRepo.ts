import { PracticeArea } from "@domain/entities/PracticeArea";
import { BaseRepository } from "./base/BaseRepo";
import {
  IPracticeareaModel,
  practiceareaModel,
} from "../model/PracticeAreaModel";
import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IMapper } from "@infrastructure/Mapper/IMapper";

export class PracticeAreaRepo
  extends BaseRepository<PracticeArea, IPracticeareaModel>
  implements IPracticAreaRepo
{
  constructor(mapper: IMapper<PracticeArea, IPracticeareaModel>) {
    super(practiceareaModel, mapper);
  }
  async findById(id: string): Promise<PracticeArea | null> {
    const data = await this.model.findOne({ _id: id });
    if (!data) return null;
    return this.mapper.toDomain(data);
  }
  async findByName(name: string): Promise<PracticeArea | null> {
    const data = await this.model.findOne({ name: name });
    return data ? this.mapper.toDomain(data) : null;
  }
}
