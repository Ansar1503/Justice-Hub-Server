import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import { BaseRepository } from "./base/BaseRepo";
import { WalletTransaction } from "@domain/entities/WalletTransactions";
import {
  IWalletTransactionModel,
  walletTransactionModel,
} from "../model/WalletTransactionModelt";
import { WalletTransactionMapper } from "@infrastructure/Mapper/Implementations/WalletTransactionMapper";

export class WalletTransactionsRepo
  extends BaseRepository<WalletTransaction, IWalletTransactionModel>
  implements IWalletTransactionsRepo
{
  constructor() {
    super(walletTransactionModel, new WalletTransactionMapper());
  }
}
