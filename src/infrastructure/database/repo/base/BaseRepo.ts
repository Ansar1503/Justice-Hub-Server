import { IMapper } from "@infrastructure/Mapper/IMapper";
import { Model } from "mongoose";

export abstract class BaseRepository<TDomain, TPersistence> {
  constructor(
    private readonly model: Model<TPersistence>,
    private readonly mapper: IMapper<TDomain, TPersistence>
  ) {}

  async create(entity: TDomain): Promise<TDomain> {
    const persistence = this.mapper.toPersistence(entity);
    const saved = await this.model.create(persistence).catch((err) => {
      throw new Error(err.message);
    });
    return this.mapper.toDomain(saved);
  }
  async findById(id: string): Promise<TDomain | null> {
    const result = await this.model.findOne({ _id: id }).catch((err) => {
      throw new Error(err.message);
    });
    return result ? this.mapper.toDomain(result) : null;
  }
  // abstract findAll(): Promise<TPersistence[]>;
  abstract delete(id: string): Promise<void>;
  // async update(id: string, data: Partial<TDomain>): Promise<TDomain | null> {
  //   const persited = this.mapper.toPersistence(data as TDomain);
  //   const updated = await this.model.findOneAndUpdate({ _id: id });
  // }
}
