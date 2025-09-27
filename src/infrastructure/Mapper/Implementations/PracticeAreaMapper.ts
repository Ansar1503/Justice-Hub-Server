import { PracticeArea } from "@domain/entities/PracticeArea";
import { IMapper } from "../IMapper";
import { IPracticeareaModel } from "@infrastructure/database/model/PracticeAreaModel";

export class PracticeAreaMapper
implements IMapper<PracticeArea, IPracticeareaModel>
{
    toDomain(persistence: IPracticeareaModel): PracticeArea {
        return PracticeArea.fromPersisted({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            specializationId: persistence.specializationId,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IPracticeareaModel[]): PracticeArea[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: PracticeArea): Partial<IPracticeareaModel> {
        return {
            _id: entity.id,
            name: entity.name,
            specializationId: entity.specializationId,
            createdAt: entity.createdAt,
            updatedAt: entity.udpatedAt,
        };
    }
}
