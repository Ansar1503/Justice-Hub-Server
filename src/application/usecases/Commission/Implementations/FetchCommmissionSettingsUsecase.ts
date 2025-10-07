import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";
import { IFetchCommissionSettingsUsecase } from "../IFetchCommissionSettingsUsecase";
import { CommissionSettingsDto } from "@src/application/dtos/Commission/CommissionSettingsDto";

export class FetchCommissionSettingsUsecase
  implements IFetchCommissionSettingsUsecase
{
  constructor(private _commissionSettings: ICommissionSettingsRepo) {}
  async execute(input: null): Promise<CommissionSettingsDto> {
    const existingCommission =
      await this._commissionSettings.fetchCommissionSettings();
    if (!existingCommission) throw new Error("no commission settingsfound");
    return {
      createdAt: existingCommission.createdAt,
      followupCommission: existingCommission.followupCommission,
      id: existingCommission.id,
      initialCommission: existingCommission.initialCommission,
      updatedAt: existingCommission.updatedAt,
    };
  }
}
