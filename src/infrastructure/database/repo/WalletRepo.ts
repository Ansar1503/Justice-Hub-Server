import { Wallet } from "@domain/entities/Wallet";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { WalletMapper } from "@infrastructure/Mapper/Implementations/WalletMapper";
import { ClientSession } from "mongoose";
import { BaseRepository } from "./base/BaseRepo";
import { IWalletModel, WalletModel } from "../model/WalletModel";

export class WalletRepo extends BaseRepository<Wallet, IWalletModel> implements IWalletRepo {
    constructor(session?: ClientSession) {
        super(WalletModel, new WalletMapper(), session);
    }
    async getWalletByUserId(userId: string): Promise<Wallet | null> {
        const wallet = await this.model.findOne({ user_id: userId }, {}, { session: this.session });
        return wallet ? this.mapper.toDomain(wallet) : null;
    }

    async updateBalance(userId: string, amount: number): Promise<Wallet | null> {
        const updatedWallet = await this.model.findOneAndUpdate(
            { user_id: userId },
            { balance: amount },
            { new: true, session: this.session },
        );
        return updatedWallet ? this.mapper.toDomain(updatedWallet) : null;
    }

    async getAdminWallet(): Promise<Wallet | null> {
        const walet = await this.model.findOne({ isAdmin: true }, {}, { session: this.session });
        return walet ? this.mapper.toDomain(walet) : null;
    }
}
