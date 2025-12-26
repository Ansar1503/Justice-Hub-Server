import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ScheduleSettingsMapper } from "@infrastructure/Mapper/Implementations/ScheduleSettingsMapper";
import ScheduleSettingsModel, { IscheduleSettingsModel } from "../model/ScheduleSettingsModel";

export class ScheduleSettingsRepository implements IScheduleSettingsRepo {
    constructor(private _mapper: IMapper<ScheduleSettings, IscheduleSettingsModel> = new ScheduleSettingsMapper()) {}
    async updateScheduleSettings(payload: ScheduleSettings): Promise<ScheduleSettings | null> {
        const update = await ScheduleSettingsModel.findOneAndUpdate(
            { lawyer_id: payload.lawyerId },
            {
                $set: {
                    slotDuration: payload.slotDuration,
                    maxDaysInAdvance: payload.maxDaysInAdvance,
                    autoConfirm: payload.autoConfirm,
                },
            },
            { upsert: true, new: true },
        );
        return this._mapper.toDomain(update);
    }

    async fetchScheduleSettings(lawyer_id: string): Promise<ScheduleSettings | null> {
        const data = await ScheduleSettingsModel.findOne({ lawyer_id });
        return data ? this._mapper.toDomain(data) : null;
    }
}
