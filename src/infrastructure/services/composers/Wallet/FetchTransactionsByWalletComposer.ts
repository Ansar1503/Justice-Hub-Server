import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchWalletTransactionByWalletController } from "@interfaces/controller/wallet/FetchWalletTransactionByWalletController";
import { FetchWalletTransactionsByWallet } from "@src/application/usecases/Wallet/implementation/FetchWalletTransactionsByWallet";

export function FetchTransactionsByWalletComposer(): IController {
  const usecase = new FetchWalletTransactionsByWallet(
    new WalletRepo(),
    new WalletTransactionsRepo()
  );
  return new FetchWalletTransactionByWalletController(usecase);
}
