import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CommissionTransactionRepo } from "@infrastructure/database/repo/CommissionTransactionRepo";
import { ReviewRepo } from "@infrastructure/database/repo/ReviewRepo";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { CommissionTransactionMapper } from "@infrastructure/Mapper/Implementations/CommissionTransactionMapper";
import { ReviewMapper } from "@infrastructure/Mapper/Implementations/ReviewMapper";
import { SessionMapper } from "@infrastructure/Mapper/Implementations/SessionMapper";
import { FetchLawyerDashboardDataController } from "@interfaces/controller/Cases/FetchLawyerDashboardController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchLawyerDashboardDataUsecase } from "@src/application/usecases/Case/Implimentations/FetchLawyerDashboardDataUsecase";

export function FetchLawyerDashboardDataComposer(): IController {
  const usecase = new FetchLawyerDashboardDataUsecase(
    new CaseRepository(new CaseMapper()),
    new AppointmentsRepository(),
    new SessionsRepository(new SessionMapper()),
    new WalletRepo(),
    new WalletTransactionsRepo(),
    new ReviewRepo(new ReviewMapper()),
    new CommissionTransactionRepo(new CommissionTransactionMapper())
  );
  return new FetchLawyerDashboardDataController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
