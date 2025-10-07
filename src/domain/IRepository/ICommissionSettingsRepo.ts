import { CommissionSettings } from "@domain/entities/CommissionSettings";
import { IBaseRepository } from "./IBaseRepo";

export interface ICommissionSettingsRepo
  extends IBaseRepository<CommissionSettings> {
  update(payload: {
    id: string;
    initialCommission: number;
    followupCommission: number;
  }): Promise<CommissionSettings | null>;
  fetchCommissionSettings(): Promise<CommissionSettings | null>;
}
