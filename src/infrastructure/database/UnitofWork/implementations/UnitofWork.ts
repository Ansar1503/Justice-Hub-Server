import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IUnitofWork } from "../IUnitofWork";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import type { ClientSession } from "mongoose";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import mongoose from "mongoose";

export class MongoUnitofWork implements IUnitofWork {
  private _session?: ClientSession;

  private _appointmentRepo: IAppointmentsRepository | undefined;
  private _walletRepo: IWalletRepo | undefined;
  private _transactionsRepo: IWalletTransactionsRepo | undefined;

  constructor(session?: ClientSession) {
    this._session = session;
  }

  get appointmentRepo(): IAppointmentsRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._appointmentRepo) {
      this._appointmentRepo = new AppointmentsRepository(this._session);
    }
    return this._appointmentRepo;
  }

  get walletRepo(): IWalletRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._walletRepo) {
      this._walletRepo = new WalletRepo(this._session);
    }
    return this._walletRepo;
  }

  get transactionsRepo(): IWalletTransactionsRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._transactionsRepo) {
      this._transactionsRepo = new WalletTransactionsRepo(this._session);
    }
    return this._transactionsRepo;
  }

  async startTransaction<T>(
    callback: (uow: IUnitofWork) => Promise<T>
  ): Promise<T> {
    if (this._session) {
      return await callback(this);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const transactionUow = new MongoUnitofWork(session);
      const result = await callback(transactionUow);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async rollback(): Promise<void> {
    if (this._session) {
      await this._session.abortTransaction();
    }
  }
}
