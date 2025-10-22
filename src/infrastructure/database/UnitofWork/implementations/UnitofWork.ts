import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";
import type { ClientSession } from "mongoose";
import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import mongoose from "mongoose";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { ClientRepository } from "@infrastructure/database/repo/ClientRepo";
import { ClientMapper } from "@infrastructure/Mapper/Implementations/ClientMapper";
import { OtpRepository } from "@infrastructure/database/repo/OtpRepo";
import { OtpMapper } from "@infrastructure/Mapper/Implementations/OtpMapper";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { LawyerVerificationRepo } from "@infrastructure/database/repo/LawyerVerificationRepo";
import { LawyerVerificationMapper } from "@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper";
import { LawyerDocumentsRepository } from "@infrastructure/database/repo/LawyerDocuemtsRepo";
import { lawyerDocumentsMapper } from "@infrastructure/Mapper/Implementations/LawyerDocumentMapper";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { ScheduleSettingsRepository } from "@infrastructure/database/repo/ScheduleSettingsRepo";
import { AvailableSlotRepository } from "@infrastructure/database/repo/AvailableSlotsRepo";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { SessionMapper } from "@infrastructure/Mapper/Implementations/SessionMapper";
import { IUnitofWork } from "../IUnitofWork";
import { ICommissionTransactionRepo } from "@domain/IRepository/ICommissionTransactionRepo";
import { CommissionTransactionRepo } from "@infrastructure/database/repo/CommissionTransactionRepo";
import { CommissionTransactionMapper } from "@infrastructure/Mapper/Implementations/CommissionTransactionMapper";
import { ICallLogs } from "@domain/IRepository/ICallLogs";
import { CallLogsRepository } from "@infrastructure/database/repo/CallLogsRepo";
import { CallLogsMapper } from "@infrastructure/Mapper/Implementations/CallLogsMapper";
import { ISubscriptionRepo } from "@domain/IRepository/ISubscriptionRepo";
import { IUserSubscriptionRepo } from "@domain/IRepository/IUserSubscriptionRepo";
import { SubscriptionRepository } from "@infrastructure/database/repo/SubscriptionRepository";
import { UserSubscriptionRepository } from "@infrastructure/database/repo/UserSubscriptionRepository";
import { UserSubscriptionMapper } from "@infrastructure/Mapper/Implementations/UserSubscriptionMapper";
import { SubscriptionPlanMapper } from "@infrastructure/Mapper/Implementations/SubscriptionMapper";

export class MongoUnitofWork implements IUnitofWork {
  private _session?: ClientSession;

  private _appointmentRepo: IAppointmentsRepository | undefined;
  private _walletRepo: IWalletRepo | undefined;
  private _transactionsRepo: IWalletTransactionsRepo | undefined;
  private _userRepo: IUserRepository | undefined;
  private _clientRepo: IClientRepository | undefined;
  private _otpRepo: IOtpRepository | undefined;
  private _lawyerRepo: ILawyerRepository | undefined;
  private _lawyerVerificationRepo: ILawyerVerificationRepo | undefined;
  private _lawyerDocumentsRepo: ILawyerDocumentsRepository | undefined;
  private _caseRepo: ICaseRepo | undefined;
  private _scheduleSettingsRepo: IScheduleSettingsRepo | undefined;
  private _availableSlotsRepo: IAvailableSlots | undefined;
  private _overrideSlotsRepo: IOverrideRepo | undefined;
  private _sessionRepo: ISessionsRepo | undefined;
  private _commissionTransactionRepo: ICommissionTransactionRepo | undefined;
  private _callLogsRepo: ICallLogs | undefined;
  private _subscriptionRepo: ISubscriptionRepo | undefined;
  private _userSubscriptionRepo: IUserSubscriptionRepo | undefined;

  constructor(session?: ClientSession) {
    this._session = session;
  }

  get subscriptionRepo(): ISubscriptionRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._subscriptionRepo) {
      this._subscriptionRepo = new SubscriptionRepository(
        new SubscriptionPlanMapper(),
        this._session
      );
    }
    return this._subscriptionRepo;
  }

  get userSubscriptionRepo(): IUserSubscriptionRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._userSubscriptionRepo) {
      this._userSubscriptionRepo = new UserSubscriptionRepository(
        new UserSubscriptionMapper(),
        this._session
      );
    }
    return this._userSubscriptionRepo;
  }

  get callLogsRepo(): ICallLogs {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._callLogsRepo) {
      this._callLogsRepo = new CallLogsRepository(
        new CallLogsMapper(),
        this._session
      );
    }
    return this._callLogsRepo;
  }

  get commissionTransactionRepo(): ICommissionTransactionRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._commissionTransactionRepo) {
      this._commissionTransactionRepo = new CommissionTransactionRepo(
        new CommissionTransactionMapper(),
        this._session
      );
    }
    return this._commissionTransactionRepo;
  }

  get caseRepo(): ICaseRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._caseRepo) {
      this._caseRepo = new CaseRepository(new CaseMapper(), this._session);
    }
    return this._caseRepo;
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

  get userRepo(): IUserRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._userRepo) {
      this._userRepo = new UserRepository(new UserMapper(), this._session);
    }
    return this._userRepo;
  }

  get clientRepo(): IClientRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._clientRepo) {
      this._clientRepo = new ClientRepository(
        new ClientMapper(),
        this._session
      );
    }
    return this._clientRepo;
  }

  get otpRepo(): IOtpRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._otpRepo) {
      this._otpRepo = new OtpRepository(new OtpMapper(), this._session);
    }
    return this._otpRepo;
  }

  get lawyerRepo(): ILawyerRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._lawyerRepo) {
      this._lawyerRepo = new LawyerRepository(
        new LawyerMapper(),
        this._session
      );
    }
    return this._lawyerRepo;
  }

  get lawyerVerificationRepo(): ILawyerVerificationRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._lawyerVerificationRepo) {
      this._lawyerVerificationRepo = new LawyerVerificationRepo(
        new LawyerVerificationMapper(),
        this._session
      );
    }
    return this._lawyerVerificationRepo;
  }

  get lawyerDocumentsRepo(): ILawyerDocumentsRepository {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._lawyerDocumentsRepo) {
      this._lawyerDocumentsRepo = new LawyerDocumentsRepository(
        new lawyerDocumentsMapper()
      );
    }
    return this._lawyerDocumentsRepo;
  }

  get scheduleSettingsRepo(): IScheduleSettingsRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._scheduleSettingsRepo) {
      this._scheduleSettingsRepo = new ScheduleSettingsRepository();
    }
    return this._scheduleSettingsRepo;
  }

  get availableSlotsRepo(): IAvailableSlots {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._availableSlotsRepo) {
      this._availableSlotsRepo = new AvailableSlotRepository();
    }
    return this._availableSlotsRepo;
  }

  get overrideSlotsRepo(): IOverrideRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._overrideSlotsRepo) {
      this._overrideSlotsRepo = new OverrideSlotsRepository();
    }
    return this._overrideSlotsRepo;
  }

  get sessionRepo(): ISessionsRepo {
    if (!this._session) {
      throw new Error(
        "Unit of Work session not initialized. Call startTransaction() first."
      );
    }
    if (!this._sessionRepo) {
      this._sessionRepo = new SessionsRepository(
        new SessionMapper(),
        this._session
      );
    }
    return this._sessionRepo;
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
