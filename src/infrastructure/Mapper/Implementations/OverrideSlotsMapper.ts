import { Override } from "@domain/entities/Override";
import { IMapper } from "../IMapper";
import { IOverrideSlotsModel } from "@infrastructure/database/model/OverrideSlotModel";

export class OverrideSlotsMapper
implements IMapper<Override, IOverrideSlotsModel>
{
    toDomain(persistence: IOverrideSlotsModel): Override {
        return Override.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            overrideDates: persistence.overrideDates,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IOverrideSlotsModel[]): Override[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: Override): Partial<IOverrideSlotsModel> {
        return {
            _id: entity.id,
            lawyer_id: entity.lawyerId,
            overrideDates: entity.overrideDates,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
