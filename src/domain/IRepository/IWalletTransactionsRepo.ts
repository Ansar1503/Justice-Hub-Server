import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { IBaseRepository } from "./IBaseRepo";
import { getWalletTransactionsRepoInputDto } from "@src/application/dtos/wallet/WalletTransactionDto";

export interface IWalletTransactionsRepo
  extends IBaseRepository<WalletTransaction> {
  findTransactionsByWalletId(
    payload: getWalletTransactionsRepoInputDto
  ): Promise<{
    data: WalletTransaction[] | [];
    page: number;
    totalPages: number;
  }>;
}
