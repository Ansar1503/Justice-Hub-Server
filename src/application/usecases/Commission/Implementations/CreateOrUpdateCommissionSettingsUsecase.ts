import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";
import { ICreateOrUpdateCommissionSettingsUsecase } from "../ICreateOrUpdateCommissionSettingsUsecase";
import {
  CreateOrUpdateCommissionSettingsInputDto,
  CommissionSettingsDto,
} from "@src/application/dtos/Commission/CommissionSettingsDto";
import { CommissionSettings } from "@domain/entities/CommissionSettings";

export class CreateOrUpdateCommissionSettingsUseCase
  implements ICreateOrUpdateCommissionSettingsUsecase
{
  constructor(private _CommisssionSettingsRepo: ICommissionSettingsRepo) {}
  async execute(
    input: CreateOrUpdateCommissionSettingsInputDto
  ): Promise<CommissionSettingsDto> {
    if (!input.id) {
      const newCommissionSettingsPayload = CommissionSettings.create({
        followupCommission: input.followupCommission,
        initialCommission: input.initialCommission,
      });
      const newCommissionSettings = await this._CommisssionSettingsRepo.create(
        newCommissionSettingsPayload
      );
      return {
        createdAt: newCommissionSettings.createdAt,
        followupCommission: newCommissionSettings.followupCommission,
        id: newCommissionSettings.id,
        initialCommission: newCommissionSettings.initialCommission,
        updatedAt: newCommissionSettings.updatedAt,
      };
    }
    const existingCommission =
      await this._CommisssionSettingsRepo.fetchCommissionSettings();
    if (!existingCommission) {
      throw new Error("Commission does not exist");
    }
    const updatedCommissionSettings =
      await this._CommisssionSettingsRepo.update({
        followupCommission: input.followupCommission,
        id: input.id,
        initialCommission: input.initialCommission,
      });
    if (!updatedCommissionSettings)
      throw new Error("commission settings update failed");
    return {
      createdAt: updatedCommissionSettings.createdAt,
      followupCommission: updatedCommissionSettings.followupCommission,
      id: updatedCommissionSettings.id,
      initialCommission: updatedCommissionSettings.initialCommission,
      updatedAt: updatedCommissionSettings.updatedAt,
    };
  }
}
