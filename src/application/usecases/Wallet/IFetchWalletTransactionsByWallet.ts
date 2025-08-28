import { getWalletTransactionsOutputDto } from "@src/application/dtos/wallet/WalletTransactionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchWalletTransactionsByWallet
  extends IUseCase<
    { userId: string; page: number },
    getWalletTransactionsOutputDto
  > {}
