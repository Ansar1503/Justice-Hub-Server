"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUnitofWork = void 0;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const WalletTransactionsRepo_1 = require("@infrastructure/database/repo/WalletTransactionsRepo");
const mongoose_1 = __importDefault(require("mongoose"));
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const ClientRepo_1 = require("@infrastructure/database/repo/ClientRepo");
const ClientMapper_1 = require("@infrastructure/Mapper/Implementations/ClientMapper");
const OtpRepo_1 = require("@infrastructure/database/repo/OtpRepo");
const OtpMapper_1 = require("@infrastructure/Mapper/Implementations/OtpMapper");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerMapper");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const LawyerDocuemtsRepo_1 = require("@infrastructure/database/repo/LawyerDocuemtsRepo");
const LawyerDocumentMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerDocumentMapper");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const ScheduleSettingsRepo_1 = require("@infrastructure/database/repo/ScheduleSettingsRepo");
const AvailableSlotsRepo_1 = require("@infrastructure/database/repo/AvailableSlotsRepo");
const OverrideSlotsRepo_1 = require("@infrastructure/database/repo/OverrideSlotsRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const SessionMapper_1 = require("@infrastructure/Mapper/Implementations/SessionMapper");
const CommissionTransactionRepo_1 = require("@infrastructure/database/repo/CommissionTransactionRepo");
const CommissionTransactionMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionTransactionMapper");
const CallLogsRepo_1 = require("@infrastructure/database/repo/CallLogsRepo");
const CallLogsMapper_1 = require("@infrastructure/Mapper/Implementations/CallLogsMapper");
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const PaymentRepo_1 = require("@infrastructure/database/repo/PaymentRepo");
const PaymentsMapper_1 = require("@infrastructure/Mapper/Implementations/PaymentsMapper");
class MongoUnitofWork {
    _session;
    _appointmentRepo;
    _walletRepo;
    _transactionsRepo;
    _userRepo;
    _clientRepo;
    _otpRepo;
    _lawyerRepo;
    _lawyerVerificationRepo;
    _lawyerDocumentsRepo;
    _caseRepo;
    _scheduleSettingsRepo;
    _availableSlotsRepo;
    _overrideSlotsRepo;
    _sessionRepo;
    _commissionTransactionRepo;
    _callLogsRepo;
    _subscriptionRepo;
    _userSubscriptionRepo;
    _paymentRepo;
    constructor(session) {
        this._session = session;
    }
    get paymentRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._paymentRepo) {
            this._paymentRepo = new PaymentRepo_1.PaymentRepo(new PaymentsMapper_1.PaymentMapper(), this._session);
        }
        return this._paymentRepo;
    }
    get subscriptionRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._subscriptionRepo) {
            this._subscriptionRepo = new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper(), this._session);
        }
        return this._subscriptionRepo;
    }
    get userSubscriptionRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._userSubscriptionRepo) {
            this._userSubscriptionRepo = new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper(), this._session);
        }
        return this._userSubscriptionRepo;
    }
    get callLogsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._callLogsRepo) {
            this._callLogsRepo = new CallLogsRepo_1.CallLogsRepository(new CallLogsMapper_1.CallLogsMapper(), this._session);
        }
        return this._callLogsRepo;
    }
    get commissionTransactionRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._commissionTransactionRepo) {
            this._commissionTransactionRepo = new CommissionTransactionRepo_1.CommissionTransactionRepo(new CommissionTransactionMapper_1.CommissionTransactionMapper(), this._session);
        }
        return this._commissionTransactionRepo;
    }
    get caseRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._caseRepo) {
            this._caseRepo = new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper(), this._session);
        }
        return this._caseRepo;
    }
    get appointmentRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._appointmentRepo) {
            this._appointmentRepo = new AppointmentsRepo_1.AppointmentsRepository(this._session);
        }
        return this._appointmentRepo;
    }
    get walletRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._walletRepo) {
            this._walletRepo = new WalletRepo_1.WalletRepo(this._session);
        }
        return this._walletRepo;
    }
    get transactionsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._transactionsRepo) {
            this._transactionsRepo = new WalletTransactionsRepo_1.WalletTransactionsRepo(this._session);
        }
        return this._transactionsRepo;
    }
    get userRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._userRepo) {
            this._userRepo = new UserRepo_1.UserRepository(new UserMapper_1.UserMapper(), this._session);
        }
        return this._userRepo;
    }
    get clientRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._clientRepo) {
            this._clientRepo = new ClientRepo_1.ClientRepository(new ClientMapper_1.ClientMapper(), this._session);
        }
        return this._clientRepo;
    }
    get otpRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._otpRepo) {
            this._otpRepo = new OtpRepo_1.OtpRepository(new OtpMapper_1.OtpMapper(), this._session);
        }
        return this._otpRepo;
    }
    get lawyerRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._lawyerRepo) {
            this._lawyerRepo = new LawyerRepo_1.LawyerRepository(new LawyerMapper_1.LawyerMapper(), this._session);
        }
        return this._lawyerRepo;
    }
    get lawyerVerificationRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._lawyerVerificationRepo) {
            this._lawyerVerificationRepo = new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper(), this._session);
        }
        return this._lawyerVerificationRepo;
    }
    get lawyerDocumentsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._lawyerDocumentsRepo) {
            this._lawyerDocumentsRepo = new LawyerDocuemtsRepo_1.LawyerDocumentsRepository(new LawyerDocumentMapper_1.lawyerDocumentsMapper());
        }
        return this._lawyerDocumentsRepo;
    }
    get scheduleSettingsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._scheduleSettingsRepo) {
            this._scheduleSettingsRepo = new ScheduleSettingsRepo_1.ScheduleSettingsRepository();
        }
        return this._scheduleSettingsRepo;
    }
    get availableSlotsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._availableSlotsRepo) {
            this._availableSlotsRepo = new AvailableSlotsRepo_1.AvailableSlotRepository();
        }
        return this._availableSlotsRepo;
    }
    get overrideSlotsRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._overrideSlotsRepo) {
            this._overrideSlotsRepo = new OverrideSlotsRepo_1.OverrideSlotsRepository();
        }
        return this._overrideSlotsRepo;
    }
    get sessionRepo() {
        if (!this._session) {
            throw new Error("Unit of Work session not initialized. Call startTransaction() first.");
        }
        if (!this._sessionRepo) {
            this._sessionRepo = new SessionRepo_1.SessionsRepository(new SessionMapper_1.SessionMapper(), this._session);
        }
        return this._sessionRepo;
    }
    async startTransaction(callback) {
        if (this._session) {
            return await callback(this);
        }
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const transactionUow = new MongoUnitofWork(session);
            const result = await callback(transactionUow);
            await session.commitTransaction();
            return result;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            await session.endSession();
        }
    }
    async rollback() {
        if (this._session) {
            await this._session.abortTransaction();
        }
    }
}
exports.MongoUnitofWork = MongoUnitofWork;
