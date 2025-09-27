import { Specialization } from "@domain/entities/Specialization";
import { ISpecializationModel } from "@infrastructure/database/model/SpecializationModel";
import { IMapper } from "../IMapper";

export class SpecializationMapper implements IMapper<Specialization, ISpecializationModel> {
    toDomain(persistence: ISpecializationModel): Specialization {
        return Specialization.fromPersisted({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: ISpecializationModel[]): Specialization[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Specialization): Partial<ISpecializationModel> {
        return {
            _id: entity.id,
            name: entity.name,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
