"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransactionsRepo = void 0;
const WalletTransactionMapper_1 = require("@infrastructure/Mapper/Implementations/WalletTransactionMapper");
const WalletTransactionModelt_1 = require("../model/WalletTransactionModelt");
const BaseRepo_1 = require("./base/BaseRepo");
class WalletTransactionsRepo extends BaseRepo_1.BaseRepository {
    constructor(session) {
        super(WalletTransactionModelt_1.walletTransactionModel, new WalletTransactionMapper_1.WalletTransactionMapper(), session);
    }
    async findTransactionsByWalletId(payload) {
        const { limit, page, walletId, endDate, search, startDate, type } = payload;
        const skip = (page - 1) * limit;
        const query = {};
        if (walletId) {
            query.walletId = walletId;
        }
        if (type) {
            query.type = type;
        }
        if (search) {
            query.description = { $regex: search, $options: "i" };
        }
        if (startDate || endDate) {
            if (startDate) {
                startDate?.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                endDate?.setHours(23, 59, 59, 999);
            }
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = startDate;
            }
            if (endDate) {
                query.createdAt.$lte = endDate;
            }
        }
        const [transactions, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.model.countDocuments(query),
        ]);
        return {
            data: transactions && this.mapper.toDomainArray
                ? this.mapper.toDomainArray(transactions)
                : [],
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByWalletId(walletId) {
        const data = await this.model.find({ walletId: walletId });
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async getRevenueSummary(startDate, endDate) {
        const result = await this.model.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
                        },
                    },
                    commissionPaid: {
                        $sum: {
                            $cond: [{ $eq: ["$category", "commission"] }, "$amount", 0],
                        },
                    },
                },
            },
        ]);
        return {
            totalRevenue: result[0]?.totalRevenue || 0,
            commissionPaid: result[0]?.commissionPaid || 0,
        };
    }
    async getRevenueTrends(startDate, endDate) {
        const results = await this.model.aggregate([
            {
                $match: {
                    status: "completed",
                    type: "credit",
                    createdAt: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        day: { $dayOfMonth: "$createdAt" },
                    },
                    revenue: { $sum: "$amount" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month",
                            day: "$_id.day",
                        },
                    },
                    revenue: 1,
                },
            },
        ]);
        return results.map((r) => ({
            date: r.date.toISOString().split("T")[0],
            revenue: r.revenue,
        }));
    }
    async getGrowthPercent(startDate, endDate) {
        const total = await this.getRevenueSummary(startDate, endDate);
        const duration = endDate.getTime() - startDate.getTime();
        const prevStart = new Date(startDate.getTime() - duration);
        const prevEnd = new Date(endDate.getTime() - duration);
        const prev = await this.getRevenueSummary(prevStart, prevEnd);
        if (prev.totalRevenue === 0)
            return 0;
        const growth = ((total.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100;
        return Number(growth.toFixed(2));
    }
    async getRecentTransactions(limit = 5) {
        const data = await this.model
            .find({ status: "completed" })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return data && this.mapper.toDomainArray
            ? this.mapper.toDomainArray(data)
            : [];
    }
    async getTopLawyerByEarnings(startDate, endDate) {
        const result = await this.model.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: "completed",
                    type: "credit",
                    category: { $in: ["payment", "transfer"] },
                },
            },
            {
                $lookup: {
                    from: "wallets",
                    localField: "walletId",
                    foreignField: "_id",
                    as: "wallet",
                },
            },
            { $unwind: "$wallet" },
            {
                $lookup: {
                    from: "lawyers",
                    localField: "wallet.user_id",
                    foreignField: "userId",
                    as: "lawyer",
                },
            },
            { $unwind: "$lawyer" },
            {
                $lookup: {
                    from: "users",
                    localField: "wallet.user_id",
                    foreignField: "user_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "cases",
                    localField: "wallet.user_id",
                    foreignField: "lawyerId",
                    as: "cases",
                },
            },
            {
                $group: {
                    _id: "$wallet.user_id",
                    name: { $first: "$user.name" },
                    earnings: { $sum: "$amount" },
                    casesHandled: { $first: { $size: "$cases" } },
                },
            },
            { $sort: { earnings: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    earnings: 1,
                    casesHandled: 1,
                },
            },
        ]);
        return result;
    }
}
exports.WalletTransactionsRepo = WalletTransactionsRepo;
