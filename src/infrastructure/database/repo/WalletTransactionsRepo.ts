import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { BaseRepository } from "./base/BaseRepo";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import {
  IWalletTransactionModel,
  walletTransactionModel,
} from "../model/WalletTransactionModelt";
import { WalletTransactionMapper } from "@infrastructure/Mapper/Implementations/WalletTransactionMapper";
import { ClientSession } from "mongoose";
import { getWalletTransactionsRepoInputDto } from "@src/application/dtos/wallet/WalletTransactionDto";

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
    const query: Record<string, any> = { walletId };

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
    const transactions = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await this.model.countDocuments({ walletId });
    return {
      data:
        transactions && this.mapper.toDomainArray
          ? this.mapper.toDomainArray(transactions)
          : [],
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
