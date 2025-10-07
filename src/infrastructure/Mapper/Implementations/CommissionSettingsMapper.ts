import { CommissionSettings } from "@domain/entities/CommissionSettings";
import { ICommissionSettingsModel } from "@infrastructure/database/model/CommissionSettingsModel";
import { IMapper } from "../IMapper";

export class CommissionSettingsMapper
  implements IMapper<CommissionSettings, ICommissionSettingsModel>
{
  toDomain(persistence: ICommissionSettingsModel): CommissionSettings {
    return CommissionSettings.fromPersistence({
      id: persistence._id,
      initialCommission: persistence.initialCommission,
      followupCommission: persistence.followupCommission,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }

  toDomainArray(persistence: ICommissionSettingsModel[]): CommissionSettings[] {
    return persistence.map((p) => this.toDomain(p));
  }

  toPersistence(entity: CommissionSettings): Partial<ICommissionSettingsModel> {
    return {
      _id: entity.id,
      initialCommission: entity.initialCommission,
      followupCommission: entity.followupCommission,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
