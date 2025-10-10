import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { DisputesRepo } from "@infrastructure/database/repo/DisputesRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { WalletTransactionsRepo } from "@infrastructure/database/repo/WalletTransactionsRepo";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FetchAdminDashboardDataController } from "@interfaces/controller/Admin/FetchAdminDashboardDataController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchAdminDashboardDataUsecase } from "@src/application/usecases/Admin/Implementations/FetchAdminDashboardDataUsecase";

export function FetchAdminDashboardDataComposer(): IController {
  const usecase = new FetchAdminDashboardDataUsecase(
    new UserRepository(),
    new WalletTransactionsRepo(),
    new DisputesRepo(),
    new CaseRepository(new CaseMapper())
  );
  return new FetchAdminDashboardDataController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
