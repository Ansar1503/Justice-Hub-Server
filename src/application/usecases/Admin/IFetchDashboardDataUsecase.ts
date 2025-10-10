import { AdminDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchDashboardDataUsecase
  extends IUseCase<{ start: Date; end: Date }, AdminDashboardDto> {}
