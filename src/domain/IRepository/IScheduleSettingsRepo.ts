import { ScheduleSettings } from "@domain/entities/ScheduleSettings";

export interface IScheduleSettingsRepo {
    updateScheduleSettings(payload: ScheduleSettings): Promise<ScheduleSettings | null>;
    fetchScheduleSettings(lawyer_id: string): Promise<ScheduleSettings | null>;
}
