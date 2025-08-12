import { ChangeLawyerVerificationInnOutDto } from "@src/application/dtos/Admin/ChangeLawyerVerificationDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IChangeLawyerVerificationStatus
  extends IUseCase<
    ChangeLawyerVerificationInnOutDto,
    ChangeLawyerVerificationInnOutDto
  > {}
