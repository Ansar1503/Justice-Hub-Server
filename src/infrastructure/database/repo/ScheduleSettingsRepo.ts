import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import ScheduleSettingsModel, {
    IscheduleSettingsModel,
} from "../model/ScheduleSettingsModel";
import { ScheduleSettingsMapper } from "@infrastructure/Mapper/Implementations/ScheduleSettingsMapper";

export class ScheduleSettingsRepository implements IScheduleSettingsRepo {
    constructor(
    private mapper: IMapper<
      ScheduleSettings,
      IscheduleSettingsModel
    > = new ScheduleSettingsMapper()
    ) {}
    async updateScheduleSettings(
        payload: ScheduleSettings
    ): Promise<ScheduleSettings | null> {
        const update = await ScheduleSettingsModel.findOneAndUpdate(
            { lawyer_id: payload.lawyerId },
            {
                $set: {
                    slotDuration: payload.slotDuration,
                    maxDaysInAdvance: payload.maxDaysInAdvance,
                    autoConfirm: payload.autoConfirm,
                },
            },
            { upsert: true, new: true }
        );
        return this.mapper.toDomain(update);
    }

    async fetchScheduleSettings(
        lawyer_id: string
    ): Promise<ScheduleSettings | null> {
        const data = await ScheduleSettingsModel.findOne({ lawyer_id });
        return data ? this.mapper.toDomain(data) : null;
    }
}
