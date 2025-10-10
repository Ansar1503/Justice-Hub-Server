import { AdminDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IFetchDashboardDataUsecase } from "../IFetchDashboardDataUsecase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";

export class FetchAdminDashboardDataUsecase
  implements IFetchDashboardDataUsecase
{
  constructor(
    private _userRepo: IUserRepository,
    private _transactionRepo: IWalletTransactionsRepo,
    private _disputesRepo: IDisputes,
    private _casesRepo: ICaseRepo
  ) {}

  async execute(input: { start: Date; end: Date }): Promise<AdminDashboardDto> {
    const [totalClients, totalLawyers] = await Promise.all([
      this._userRepo.countTotalClients(),
      this._userRepo.countTotalLawyers(),
    ]);

    const totalUsers = totalClients + totalLawyers;

    const [
      { totalRevenue, commissionPaid },
      topLawyers,
      recentTransactions,
      recentDisputes,
      activeCases,
      disputesOpen,
      growthPercent,
    ] = await Promise.all([
      this._transactionRepo.getRevenueSummary(input.start, input.end),
      this._transactionRepo.getTopLawyerByEarnings(input.start, input.end),
      this._transactionRepo.getRecentTransactions(5),
      this._disputesRepo.getRecentDisputes(5),
      this._casesRepo.countOpen(),
      this._disputesRepo.countOpen(),
      this._transactionRepo.getGrowthPercent(input.start, input.end),
    ]);

    const [revenueTrends, caseTrends] = await Promise.all([
      this._transactionRepo.getRevenueTrends(input.start, input.end),
      this._casesRepo.getCaseTrends(input.start, input.end),
    ]);

    const caseMap = new Map(caseTrends.map((c) => [c.date, c.cases]));
    const trends = revenueTrends.map((r) => ({
      date: r.date,
      revenue: r.revenue,
      cases: caseMap.get(r.date) || 0,
    }));

    return {
      summary: {
        totalUsers,
        totalLawyers,
        totalClients,
        totalRevenue,
        commissionPaid,
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
