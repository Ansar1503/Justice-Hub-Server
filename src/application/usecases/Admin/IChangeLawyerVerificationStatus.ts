import { ChangeLawyerVerificationInnOutDto } from "@src/application/dtos/Admin/ChangeLawyerVerificationDto";
import { IUseCase } from "../I_usecases/IUseCase";

export interface IChangeLawyerVerificationStatus
  extends IUseCase<
    ChangeLawyerVerificationInnOutDto,
    ChangeLawyerVerificationInnOutDto
  > {}
