import { CommissionTransaction } from "@domain/entities/CommissionTransaction";
import { IBaseRepository } from "./IBaseRepo";

export interface ICommissionTransactionRepo
  extends IBaseRepository<CommissionTransaction> {
  findByBookingId(id: string): Promise<CommissionTransaction | null>;
  update(payload: {
    id: string;
    status: CommissionTransaction["status"];
  }): Promise<CommissionTransaction | null>;
  findByUserId(userId: string): Promise<CommissionTransaction[] | []>;
  getCommissionSummary(
    start: Date,
    end: Date
  ): Promise<{
    totalCommission: number;
    totalLawyerShare: number;
    totalCollected: number;
  }>;
  getCommissionTrends(
    start: Date,
    end: Date
  ): Promise<
    {
      date: string;
      revenue: number;
    }[]
  >;
  getCommissionGrowth(start: Date, end: Date): Promise<number>;
}
