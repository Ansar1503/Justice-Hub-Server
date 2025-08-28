import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { IBaseRepository } from "./IBaseRepo";

export interface IWalletTransactionsRepo
  extends IBaseRepository<WalletTransaction> {
  findTransactionsByWalletId(payload: {
    walletId: string;
    page: number;
  }): Promise<{
    data: WalletTransaction[] | [];
    page: number;
    totalPages: number;
  }>;
}
