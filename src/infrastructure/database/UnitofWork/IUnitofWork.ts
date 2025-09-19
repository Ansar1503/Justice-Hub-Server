import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { ICaseRepo } from "@domain/IRepository/ICaseRepo";
import { IClientRepository } from "@domain/IRepository/IClientRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IOtpRepository } from "@domain/IRepository/IOtpRepo";
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
  userRepo: IUserRepository;
  clientRepo: IClientRepository;
  otpRepo: IOtpRepository;
  lawyerRepo: ILawyerRepository;
  lawyerVerificationRepo: ILawyerVerificationRepo;
  lawyerDocumentsRepo: ILawyerDocumentsRepository;
}
