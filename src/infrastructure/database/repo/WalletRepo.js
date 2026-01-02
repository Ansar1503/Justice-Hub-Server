"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepo = void 0;
const WalletMapper_1 = require("@infrastructure/Mapper/Implementations/WalletMapper");
const BaseRepo_1 = require("./base/BaseRepo");
const WalletModel_1 = require("../model/WalletModel");
class WalletRepo extends BaseRepo_1.BaseRepository {
    constructor(session) {
        super(WalletModel_1.WalletModel, new WalletMapper_1.WalletMapper(), session);
    }
    async getWalletByUserId(userId) {
        const wallet = await this.model.findOne({ user_id: userId }, {}, { session: this.session });
        return wallet ? this.mapper.toDomain(wallet) : null;
    }
    async updateBalance(userId, amount) {
        const updatedWallet = await this.model.findOneAndUpdate({ user_id: userId }, { balance: amount }, { new: true, session: this.session });
        return updatedWallet ? this.mapper.toDomain(updatedWallet) : null;
    }
    async getAdminWallet() {
        const walet = await this.model.findOne({ isAdmin: true }, {}, { session: this.session });
        return walet ? this.mapper.toDomain(walet) : null;
    }
}
exports.WalletRepo = WalletRepo;
