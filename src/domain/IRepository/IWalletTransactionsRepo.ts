import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { getWalletTransactionsRepoInputDto } from "@src/application/dtos/wallet/WalletTransactionDto";
import { IBaseRepository } from "./IBaseRepo";

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
}
