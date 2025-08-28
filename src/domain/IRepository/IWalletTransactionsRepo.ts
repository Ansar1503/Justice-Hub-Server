import { WalletTransaction } from "@domain/entities/WalletTransactions";
import { IBaseRepository } from "./IBaseRepo";

export interface IWalletTransactionsRepo
  extends IBaseRepository<WalletTransaction> {}
