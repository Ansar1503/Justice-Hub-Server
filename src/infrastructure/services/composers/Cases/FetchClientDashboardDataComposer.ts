import { AppointmentsRepository } from "@infrastructure/database/repo/AppointmentsRepo";
import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { UserRepository } from "@infrastructure/database/repo/UserRepo";
import { WalletRepo } from "@infrastructure/database/repo/WalletRepo";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { SessionMapper } from "@infrastructure/Mapper/Implementations/SessionMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { FetchClientDashboardDataController } from "@interfaces/controller/Cases/FetchClientDashboardDataController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchClientDashboardDataUsecase } from "@src/application/usecases/Case/Implimentations/FetchClientDashboardDataUsecase";

export function FetchClientDashboardDataComposer(): IController {
  const usecase = new FetchClientDashboardDataUsecase(
    new CaseRepository(new CaseMapper()),
    new AppointmentsRepository(),
    new WalletRepo(),
    new UserRepository(new UserMapper()),
    new SessionsRepository(new SessionMapper())
  );
  return new FetchClientDashboardDataController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
