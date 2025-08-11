import { IFetchSlotSettingsUseCase } from "../IFetchSlotSettingsUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { ScheduleSettingsOutputDto } from "@src/application/dtos/Lawyer/ScheduleSettingsDto";

export class FetchSlotSettingsUseCase implements IFetchSlotSettingsUseCase {
  constructor(private scheduleSettingsRepo: IScheduleSettingsRepo) {}
  async execute(input: string): Promise<ScheduleSettingsOutputDto | null> {
    const settings = await this.scheduleSettingsRepo.fetchScheduleSettings(
      input
    );
    if (!settings) return null;
    return {
      autoConfirm: settings.autoConfirm,
      createdAt: settings.createdAt,
      id: settings.id,
      lawyer_id: settings.lawyerId,
      maxDaysInAdvance: settings.maxDaysInAdvance,
      slotDuration: settings.slotDuration,
      updatedAt: settings.updatedAt,
    };
  }
}
