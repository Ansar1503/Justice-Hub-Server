import { AdminDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IFetchDashboardDataUsecase } from "../IFetchDashboardDataUsecase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";

export class FetchAdminDashboardDataUsecase
  implements IFetchDashboardDataUsecase {
  constructor(
    private _userRepo: IUserRepository,
    private _transactionRepo: IWalletTransactionsRepo,
    private _disputesRepo: IDisputes,
    private _casesRepo: ICaseRepo,
    private _commissionRepo: ICommissionTransactionRepo,
    private _subscriptionRepo: IUserSubscriptionRepo,
  ) { }

  async execute(input: { start: Date; end: Date }): Promise<AdminDashboardDto> {
    const { start, end } = input;
    const [
      totalClients,
      totalLawyers,
      activeCases,
    ] = await Promise.all([
      this._userRepo.countTotalClients(),
      this._userRepo.countTotalLawyers(),
      this._casesRepo.countOpen(),
    ]);
    const totalUsers = totalClients + totalLawyers;
    const commissionSummary = await this._commissionRepo.getCommissionSummary(start, end);
    const commissionGrowth = await this._commissionRepo.getCommissionGrowth(start, end);

    const [
      subscriptionSummary,
      subscriptionGrowth,
      activeSubscriptions,
      expiredSubscriptions,
      newSubscriptions,
    ] = await Promise.all([
      this._subscriptionRepo.getSubscriptionRevenueSummary(start, end),
      this._subscriptionRepo.getSubscriptionGrowth(start, end),
      this._subscriptionRepo.countActiveSubscriptions(),
      this._subscriptionRepo.countExpiredSubscriptions(),
      this._subscriptionRepo.countNewSubscriptions(start, end),
    ]);

    const [commissionTrends, subscriptionTrends, caseTrends] = await Promise.all([
      this._commissionRepo.getCommissionTrends(start, end),
      this._subscriptionRepo.getSubscriptionTrends(start, end),
      this._casesRepo.getCaseTrends(start, end),
    ]);

    const caseMap = new Map(caseTrends.map((c) => [c.date, c.cases]));
    const trends = commissionTrends.map((r) => ({
      date: r.date,
      commissionRevenue: r.revenue,
      subscriptionRevenue:
        subscriptionTrends.find((s) => s.date === r.date)?.revenue ?? 0,
      cases: caseMap.get(r.date) || 0,
    }));

    const [topLawyers, recentTransactions, recentDisputes] = await Promise.all([
      this._transactionRepo.getTopLawyerByEarnings(start, end),
      this._transactionRepo.getRecentTransactions(5),
      this._disputesRepo.getRecentDisputes(5),
    ]);
    const totalRevenue =
      commissionSummary.totalCommission +
      subscriptionSummary.totalSubscriptionRevenue;
    console.log({
      summary: {
        totalUsers,
        totalLawyers,
        totalClients,
        activeCases,
        totalCommission: commissionSummary.totalCommission,
        totalLawyerPayouts: commissionSummary.totalLawyerShare,
        totalBookingAmountCollected: commissionSummary.totalCollected,
        commissionGrowthPercent: commissionGrowth,
        subscriptionRevenue: subscriptionSummary.totalSubscriptionRevenue,
        subscriptionGrowthPercent: subscriptionGrowth,
        activeSubscriptions,
        expiredSubscriptions,
        newSubscriptions,
        totalRevenue,
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
    });
    return {
      summary: {
        totalUsers,
        totalLawyers,
        totalClients,
        activeCases,
        totalCommission: commissionSummary.totalCommission,
        totalLawyerPayouts: commissionSummary.totalLawyerShare,
        totalBookingAmountCollected: commissionSummary.totalCollected,
        commissionGrowthPercent: commissionGrowth,
        subscriptionRevenue: subscriptionSummary.totalSubscriptionRevenue,
        subscriptionGrowthPercent: subscriptionGrowth,
        activeSubscriptions,
        expiredSubscriptions,
        newSubscriptions,
        totalRevenue,
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
