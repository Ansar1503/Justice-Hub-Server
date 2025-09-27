import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IMapper } from "../IMapper";
import { IscheduleSettingsModel } from "@infrastructure/database/model/ScheduleSettingsModel";

export class ScheduleSettingsMapper
implements IMapper<ScheduleSettings, IscheduleSettingsModel>
{
    toDomain(persistence: IscheduleSettingsModel): ScheduleSettings {
        return ScheduleSettings.fromPersistence({
            id: persistence._id,
            lawyer_id: persistence.lawyer_id,
            autoConfirm: persistence.autoConfirm,
            maxDaysInAdvance: persistence.maxDaysInAdvance,
            slotDuration: persistence.slotDuration,
            createdAt: persistence.createdAt,
            updatedAt: persistence.updatedAt,
        });
    }
    toDomainArray(persistence: IscheduleSettingsModel[]): ScheduleSettings[] {
        return persistence.map((p) => this.toDomain(p));
    }
    toPersistence(entity: ScheduleSettings): Partial<IscheduleSettingsModel> {
        return {
            _id: entity.id,
            lawyer_id: entity.lawyerId,
            autoConfirm: entity.autoConfirm,
            maxDaysInAdvance: entity.maxDaysInAdvance,
            slotDuration: entity.slotDuration,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
