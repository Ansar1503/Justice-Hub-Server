import { ScheduleSettings } from "@domain/entities/ScheduleSettings";
import { IUpdateSlotSettingsUseCase } from "../IUpdateSlotSettingsUseCase";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { UpdateSlotSettingsInputDto } from "@src/application/dtos/Lawyer/UpdateSlotSettingsDto";

export class UpdateSlotSettingsUseCase implements IUpdateSlotSettingsUseCase {
    constructor(private SchduleSettingRepo: IScheduleSettingsRepo) {}
    async execute(
        input: UpdateSlotSettingsInputDto
    ): Promise<ScheduleSettings | null> {
        if (input.slotDuration > 120 || input.slotDuration < 15)
            throw new Error("INVALIDDURATION");
        if (input.maxDaysInAdvance < 15 || input.maxDaysInAdvance > 90)
            throw new Error("INVALIDADVANCE");
        const settingspayload = ScheduleSettings.create({
            autoConfirm: input.autoConfirm,
            lawyer_id: input.lawyer_id,
            maxDaysInAdvance: input.maxDaysInAdvance,
            slotDuration: input.slotDuration,
        });
        const updatedSettings =
      await this.SchduleSettingRepo.updateScheduleSettings(settingspayload);
        return updatedSettings;
    }
}
