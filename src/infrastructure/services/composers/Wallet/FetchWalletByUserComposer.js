"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWalletByUserComposer = FetchWalletByUserComposer;
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const FetchWalletByUser_1 = require("@interfaces/controller/wallet/FetchWalletByUser");
const FetchWalletByUser_2 = require("@src/application/usecases/Wallet/implementation/FetchWalletByUser");
function FetchWalletByUserComposer() {
    const usecase = new FetchWalletByUser_2.FetchWalletByUser(new WalletRepo_1.WalletRepo());
    return new FetchWalletByUser_1.FetchWalletByUserController(usecase);
}
