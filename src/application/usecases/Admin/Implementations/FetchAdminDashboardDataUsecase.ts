import { AdminDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IFetchDashboardDataUsecase } from "../IFetchDashboardDataUsecase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";

export class FetchAdminDashboardDataUsecase
  implements IFetchDashboardDataUsecase
{
  constructor(
    private _userRepo: IUserRepository,
    private _transactionRepo: IWalletTransactionsRepo,
    private _disputesRepo: IDisputes,
    private _casesRepo: ICaseRepo,
    private _commissionRepo: ICommissionTransactionRepo
  ) {}

  async execute(input: { start: Date; end: Date }): Promise<AdminDashboardDto> {
    const [totalClients, totalLawyers] = await Promise.all([
      this._userRepo.countTotalClients(),
      this._userRepo.countTotalLawyers(),
    ]);

    const totalUsers = totalClients + totalLawyers;

    const [
      commissionSummary,
      topLawyers,
      recentTransactions,
      recentDisputes,
      activeCases,
      disputesOpen,
      growthPercent,
    ] = await Promise.all([
      this._commissionRepo.getCommissionSummary(input.start, input.end),
      this._transactionRepo.getTopLawyerByEarnings(input.start, input.end),
      this._transactionRepo.getRecentTransactions(5),
      this._disputesRepo.getRecentDisputes(5),
      this._casesRepo.countOpen(),
      this._disputesRepo.countOpen(),
      this._transactionRepo.getGrowthPercent(input.start, input.end),
    ]);

    const [commissionTrends, caseTrends] = await Promise.all([
      this._commissionRepo.getCommissionTrends(input.start, input.end),
      this._casesRepo.getCaseTrends(input.start, input.end),
    ]);

    const caseMap = new Map(caseTrends.map((c) => [c.date, c.cases]));
    const trends = commissionTrends.map((r) => ({
      date: r.date,
      revenue: r.revenue,
      cases: caseMap.get(r.date) || 0,
    }));

    return {
      summary: {
        totalUsers,
        totalLawyers,
        totalClients,
        totalRevenue: commissionSummary.totalCommission, // ✅ admin’s profit
        commissionPaid: commissionSummary.totalLawyerShare, // ✅ paid to lawyers
        activeCases,
        disputesOpen,
        growthPercent,
      },
      trends,
      topLawyers,
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        amount: t.amount,
        status: t.status,
        date: t.createdAt.toISOString(),
      })),
      recentDisputes,
    };
  }
}
