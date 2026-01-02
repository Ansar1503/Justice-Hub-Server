"use strict";
// import {
//   addFundsToWalletInputDto,
//   addFundsToWalletOutputDto,
// } from "@src/application/dtos/wallet/WalletTransactionDto";
// import { IAddFundsUsecase } from "../IAddFundsUsecase";
// import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
// import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
// import { WalletTransaction } from "@domain/entities/WalletTransactions";
// import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";
Object.defineProperty(exports, "__esModule", { value: true });
// export class AddFundsUsecase implements IAddFundsUsecase {
//   constructor(
//     private walletRepo: IWalletRepo,
//     private walletTransaction: IWalletTransactionsRepo
//   ) {}
//   async execute(
//     input: addFundsToWalletInputDto
//   ): Promise<addFundsToWalletOutputDto> {
//     const wallet = await this.walletRepo.getWalletByUserId(input.userId);
//     if (!wallet) throw new Error("Wallet  does not exist");
//     const desc = generateDescription({
//       amount: input.amount,
//       category: "deposit",
//       type: "credit",
//     });
//     const transaction = WalletTransaction.create({
//       amount: input.amount,
//       category: "deposit",
//       description: desc,
//       type: "credit",
//       status:""
//     });
//   }
// }
