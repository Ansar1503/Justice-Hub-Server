import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { WalletTransactionMapper } from "@infrastructure/Mapper/Implementations/WalletTransactionMapper";
import { ClientSession } from "mongoose";
import { getWalletTransactionsRepoInputDto } from "@src/application/dtos/wallet/WalletTransactionDto";
import {
  IWalletTransactionModel,
  walletTransactionModel,
} from "../model/WalletTransactionModelt";
import { BaseRepository } from "./base/BaseRepo";
import { TopLawyerDto } from "@src/application/dtos/client/DashboardDto";

export class WalletTransactionsRepo
  extends BaseRepository<WalletTransaction, IWalletTransactionModel>
  implements IWalletTransactionsRepo
{
  constructor(session?: ClientSession) {
    super(walletTransactionModel, new WalletTransactionMapper(), session);
  }
  async findTransactionsByWalletId(
    payload: getWalletTransactionsRepoInputDto
  ): Promise<{
    data: WalletTransaction[] | [];
    page: number;
    totalPages: number;
  }> {
    const { limit, page, walletId, endDate, search, startDate, type } = payload;
    const skip = (page - 1) * limit;
    const query: Record<string, any> = {};
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
      data:
        transactions && this.mapper.toDomainArray
          ? this.mapper.toDomainArray(transactions)
          : [],
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findByWalletId(walletId: string): Promise<WalletTransaction[] | []> {
    const data = await this.model.find({ walletId: walletId });
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
  async getRevenueSummary(
    startDate: Date,
    endDate: Date
  ): Promise<{
    totalRevenue: number;
    commissionPaid: number;
  }> {
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

  async getRevenueTrends(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; revenue: number }[]> {
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
  async getGrowthPercent(startDate: Date, endDate: Date): Promise<number> {
    const total = await this.getRevenueSummary(startDate, endDate);
    const duration = endDate.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - duration);
    const prevEnd = new Date(endDate.getTime() - duration);

    const prev = await this.getRevenueSummary(prevStart, prevEnd);

    if (prev.totalRevenue === 0) return 0;
    const growth =
      ((total.totalRevenue - prev.totalRevenue) / prev.totalRevenue) * 100;

    return Number(growth.toFixed(2));
  }

  async getRecentTransactions(limit = 5): Promise<WalletTransaction[] | []> {
    const data = await this.model
      .find({ status: "completed" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return data && this.mapper.toDomainArray
      ? this.mapper.toDomainArray(data)
      : [];
  }
  async getTopLawyerByEarnings(
    startDate: Date,
    endDate: Date
  ): Promise<TopLawyerDto[]> {
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

    return result as TopLawyerDto[];
  }
}
