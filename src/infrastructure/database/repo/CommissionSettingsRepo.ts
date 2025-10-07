import { CommissionSettings } from "@domain/entities/CommissionSettings";
import { ICommissionSettingsRepo } from "@domain/IRepository/ICommissionSettingsRepo";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import {
  CommissionSettingsModel,
  ICommissionSettingsModel,
} from "../model/CommissionSettingsModel";
import { BaseRepository } from "./base/BaseRepo";

export class CommissionSettingsRepo
  extends BaseRepository<CommissionSettings, ICommissionSettingsModel>
  implements ICommissionSettingsRepo
{
  constructor(mapper: IMapper<CommissionSettings, ICommissionSettingsModel>) {
    super(CommissionSettingsModel, mapper);
  }
  async fetchCommissionSettings(): Promise<CommissionSettings | null> {
    const data = await this.model.findOne();
    if (!data) return null;
    return this.mapper.toDomain(data);
  }
  async update(payload: {
    id: string;
    initialCommission: number;
    followupCommission: number;
  }): Promise<CommissionSettings | null> {
    const updated = await this.model.findOneAndUpdate(
      { _id: payload.id },
      {
        initialCommission: payload.initialCommission,
        followupCommission: payload.followupCommission,
      },
      { new: true }
    );
    return updated ? this.mapper.toDomain(updated) : null;
  }
}
