import {
  getWalletTransactionsInputDto,
  getWalletTransactionsOutputDto,
} from "@src/application/dtos/wallet/WalletTransactionDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchWalletTransactionsByWallet
  extends IUseCase<
    getWalletTransactionsInputDto,
    getWalletTransactionsOutputDto
  > {}
