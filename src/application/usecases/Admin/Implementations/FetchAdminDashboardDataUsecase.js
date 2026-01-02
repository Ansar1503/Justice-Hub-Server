"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminDashboardDataUsecase = void 0;
class FetchAdminDashboardDataUsecase {
    _userRepo;
    _transactionRepo;
    _disputesRepo;
    _casesRepo;
    _commissionRepo;
    _subscriptionRepo;
    constructor(_userRepo, _transactionRepo, _disputesRepo, _casesRepo, _commissionRepo, _subscriptionRepo) {
        this._userRepo = _userRepo;
        this._transactionRepo = _transactionRepo;
        this._disputesRepo = _disputesRepo;
        this._casesRepo = _casesRepo;
        this._commissionRepo = _commissionRepo;
        this._subscriptionRepo = _subscriptionRepo;
    }
    async execute(input) {
        const { start, end } = input;
        const [totalClients, totalLawyers, activeCases,] = await Promise.all([
            this._userRepo.countTotalClients(),
            this._userRepo.countTotalLawyers(),
            this._casesRepo.countOpen(),
        ]);
        const totalUsers = totalClients + totalLawyers;
        const commissionSummary = await this._commissionRepo.getCommissionSummary(start, end);
        const commissionGrowth = await this._commissionRepo.getCommissionGrowth(start, end);
        const [subscriptionSummary, subscriptionGrowth, activeSubscriptions, expiredSubscriptions, newSubscriptions,] = await Promise.all([
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
            subscriptionRevenue: subscriptionTrends.find((s) => s.date === r.date)?.revenue ?? 0,
            cases: caseMap.get(r.date) || 0,
        }));
        const [topLawyers, recentTransactions, recentDisputes] = await Promise.all([
            this._transactionRepo.getTopLawyerByEarnings(start, end),
            this._transactionRepo.getRecentTransactions(5),
            this._disputesRepo.getRecentDisputes(5),
        ]);
        const totalRevenue = commissionSummary.totalCommission +
            subscriptionSummary.totalSubscriptionRevenue;
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
exports.FetchAdminDashboardDataUsecase = FetchAdminDashboardDataUsecase;
