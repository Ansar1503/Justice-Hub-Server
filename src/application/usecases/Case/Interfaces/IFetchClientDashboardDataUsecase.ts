import { ClientDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchClientDashboardDataUsecase
  extends IUseCase<string, ClientDashboardDto> {}
