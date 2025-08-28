import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { BaseRepository } from "./base/BaseRepo";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import {
  IWalletTransactionModel,
  walletTransactionModel,
} from "../model/WalletTransactionModelt";
import { WalletTransactionMapper } from "@infrastructure/Mapper/Implementations/WalletTransactionMapper";
import { ClientSession } from "mongoose";

export class WalletTransactionsRepo
  extends BaseRepository<WalletTransaction, IWalletTransactionModel>
  implements IWalletTransactionsRepo
{
  constructor(session?: ClientSession) {
    super(walletTransactionModel, new WalletTransactionMapper(), session);
  }
  async findTransactionsByWalletId({
    walletId,
    page,
  }: {
    walletId: string;
    page: number;
  }): Promise<{
    data: WalletTransaction[] | [];
    page: number;
    totalPages: number;
  }> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const transactions = await this.model
      .find({ walletId })
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
