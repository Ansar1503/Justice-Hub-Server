import { LawyerVerification } from "@domain/entities/LawyerVerification";
import { IBaseRepository } from "./IBaseRepo";
import { lawyerVerificationDetails } from "@src/application/dtos/Lawyer/LawyerVerificationDetailsDto";

export interface ILawyerVerificationRepo
  extends IBaseRepository<LawyerVerification> {
  findByUserId(id: string): Promise<lawyerVerificationDetails | null>;
  update(
    payload: Partial<LawyerVerification>
  ): Promise<LawyerVerification | null>;
}
