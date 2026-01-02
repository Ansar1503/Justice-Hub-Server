"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchTransactionsByWalletComposer = FetchTransactionsByWalletComposer;
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const WalletTransactionsRepo_1 = require("@infrastructure/database/repo/WalletTransactionsRepo");
const FetchWalletTransactionByWalletController_1 = require("@interfaces/controller/wallet/FetchWalletTransactionByWalletController");
const FetchWalletTransactionsByWallet_1 = require("@src/application/usecases/Wallet/implementation/FetchWalletTransactionsByWallet");
function FetchTransactionsByWalletComposer() {
    const usecase = new FetchWalletTransactionsByWallet_1.FetchWalletTransactionsByWallet(new WalletRepo_1.WalletRepo(), new WalletTransactionsRepo_1.WalletTransactionsRepo());
    return new FetchWalletTransactionByWalletController_1.FetchWalletTransactionByWalletController(usecase);
}
