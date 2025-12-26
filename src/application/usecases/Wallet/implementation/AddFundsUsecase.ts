// import {
//   addFundsToWalletInputDto,
//   addFundsToWalletOutputDto,
// } from "@src/application/dtos/wallet/WalletTransactionDto";
// import { IAddFundsUsecase } from "../IAddFundsUsecase";
// import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
// import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
// import { WalletTransaction } from "@domain/entities/WalletTransactions";
// import { generateDescription } from "@shared/utils/helpers/WalletDescriptionsHelper";

// export class AddFundsUsecase implements IAddFundsUsecase {
//   constructor(
//     private _walletRepo: IWalletRepo,
//     private _walletTransaction: IWalletTransactionsRepo
//   ) {}
//   async execute(
//     input: addFundsToWalletInputDto
//   ): Promise<addFundsToWalletOutputDto> {
//     const wallet = await this._walletRepo.getWalletByUserId(input.userId);
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
