import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IAvailableSlots } from "@domain/IRepository/IAvailableSlots";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IScheduleSettingsRepo } from "@domain/IRepository/IScheduleSettingsRepo";
import { ISessionsRepo } from "@domain/IRepository/ISessionsRepo";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";

export interface IUnitofWork {
    startTransaction<T>(callback: (uow: IUnitofWork) => Promise<T>): Promise<T>;
    rollback(): Promise<void>;

    caseRepo: ICaseRepo;
    walletRepo: IWalletRepo;
    transactionsRepo: IWalletTransactionsRepo;
    appointmentRepo: IAppointmentsRepository;
    scheduleSettingsRepo: IScheduleSettingsRepo;
    availableSlotsRepo: IAvailableSlots;
    overrideSlotsRepo: IOverrideRepo;
    userRepo: IUserRepository;
    clientRepo: IClientRepository;
    otpRepo: IOtpRepository;
    lawyerRepo: ILawyerRepository;
    lawyerVerificationRepo: ILawyerVerificationRepo;
    lawyerDocumentsRepo: ILawyerDocumentsRepository;
    sessionRepo: ISessionsRepo;
}
