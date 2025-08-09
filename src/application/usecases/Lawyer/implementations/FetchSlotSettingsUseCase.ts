import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IFetchSlotSettingsUseCase } from "../IFetchSlotSettingsUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";

export class FetchSlotSettingsUseCase implements IFetchSlotSettingsUseCase {
  constructor(private scheduleSettingsRepo: IScheduleSettingsRepo) {}
  async execute(input: string): Promise<ScheduleSettings | null> {
    const settings = await this.scheduleSettingsRepo.fetchScheduleSettings(
      input
    );
    return settings;
  }
}
