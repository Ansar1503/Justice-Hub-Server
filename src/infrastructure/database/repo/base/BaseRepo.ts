import { IBaseRepository } from "@domain/IRepository/IBaseRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Model } from "mongoose";

export abstract class BaseRepository<TDomain, TPersistence>
  implements IBaseRepository<TDomain>
{
  constructor(
    protected readonly model: Model<TPersistence>,
    protected readonly mapper: IMapper<TDomain, TPersistence>
  ) {}

  async create(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.model.create(persistence).catch((err) => {
      throw new Error(err.message);
    });
    return this.mapper.toDomain(saved);
  }
}
