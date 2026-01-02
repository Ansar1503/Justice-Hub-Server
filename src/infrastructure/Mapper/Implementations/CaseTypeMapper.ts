import { ICasetypeModel } from "@infrastructure/database/model/CaseTypeModel";
import { IMapper } from "../IMapper";
import { CaseType } from "@domain/entities/CaseType";

export class CaseTypeMapper implements IMapper<CaseType, ICasetypeModel> {
    toDomain(persistence: ICasetypeModel): CaseType {
        return CaseType.fromPersistance({
            createdAt: persistence.createdAt,
            id: persistence._id,
            name: persistence.name,
            practiceareaId: persistence.practiceareaId,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: ICasetypeModel[]): CaseType[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: CaseType): Partial<ICasetypeModel> {
        return {
            _id: entity.id,
            createdAt: entity.createdAt,
            name: entity.name,
            practiceareaId: entity.practiceareaId,
            updatedAt: entity.updatedAt,
        };
    }
}
