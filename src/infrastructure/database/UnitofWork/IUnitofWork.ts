import { IAppointmentsRepository } from "@domain/IRepository/IAppointmentsRepo";
import { IWalletRepo } from "@domain/IRepository/IWalletRepo";
import { IWalletTransactionsRepo } from "@domain/IRepository/IWalletTransactionsRepo";

export interface IUnitofWork {
  startTransaction<T>(callback: (uow: IUnitofWork) => Promise<T>): Promise<T>;
  rollback(): Promise<void>;

  walletRepo: IWalletRepo;
  transactionsRepo: IWalletTransactionsRepo;
  appointmentRepo: IAppointmentsRepository;
}
