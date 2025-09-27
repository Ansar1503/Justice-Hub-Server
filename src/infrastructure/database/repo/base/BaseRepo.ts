import { IBaseRepository } from "@domain/IRepository/IBaseRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession, Model } from "mongoose";

export abstract class BaseRepository<TDomain, TPersistence> implements IBaseRepository<TDomain> {
    constructor(
        protected readonly model: Model<TPersistence>,
        protected readonly mapper: IMapper<TDomain, TPersistence>,
        protected readonly session?: ClientSession,
    ) {}

    async create(entity: TDomain): Promise<TDomain> {
        const persistence = this.mapper.toPersistence(entity);
        const doc = new this.model(persistence);
        const saved = await doc.save({ session: this.session }).catch((err) => {
            throw new Error(err.message);
        });
        return this.mapper.toDomain(saved.toObject());
    }
}
