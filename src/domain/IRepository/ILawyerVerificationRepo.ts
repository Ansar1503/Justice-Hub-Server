import { LawyerVerification } from "@domain/entities/LawyerVerification";
import { IBaseRepository } from "./IBaseRepo";

export interface ILawyerVerificationRepo
  extends IBaseRepository<LawyerVerification> {
  findByUserId(id: string): Promise<LawyerVerification | null>;
  update(
    payload: Partial<LawyerVerification>
  ): Promise<LawyerVerification | null>;
}
