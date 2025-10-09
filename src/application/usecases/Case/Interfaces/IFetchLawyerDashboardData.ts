import { LawyerDashboardDto } from "@src/application/dtos/client/DashboardDto";
import { IUseCase } from "../../IUseCases/IUseCase";

export interface IFetchLawyerDashboardDataUsecase
  extends IUseCase<string, LawyerDashboardDto> {}
