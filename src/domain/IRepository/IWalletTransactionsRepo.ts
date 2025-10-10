import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { getWalletTransactionsRepoInputDto } from "@src/application/dtos/wallet/WalletTransactionDto";
import { IBaseRepository } from "./IBaseRepo";
import { TopLawyerDto } from "@src/application/dtos/client/DashboardDto";

export interface IWalletTransactionsRepo
  extends IBaseRepository<WalletTransaction> {
  findTransactionsByWalletId(
    payload: getWalletTransactionsRepoInputDto
  ): Promise<{
    data: WalletTransaction[] | [];
    page: number;
    totalPages: number;
  }>;
  findByWalletId(walletId: string): Promise<WalletTransaction[] | []>;
  getRevenueSummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    commissionPaid: number;
  }>;
  getRevenueTrends(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; revenue: number }[]>;
  getGrowthPercent(startDate: Date, endDate: Date): Promise<number>;
  getRecentTransactions(limit: number): Promise<WalletTransaction[] | []>;
  getTopLawyerByEarnings(
    startDate: Date,
    endDate: Date
  ): Promise<TopLawyerDto[]>;
}
