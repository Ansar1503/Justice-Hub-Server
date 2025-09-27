import { LawyerVerification } from "@domain/entities/LawyerVerification";
import { lawyerVerificationDetails } from "@src/application/dtos/Lawyer/LawyerVerificationDetailsDto";
import { IBaseRepository } from "./IBaseRepo";

export interface ILawyerVerificationRepo extends IBaseRepository<LawyerVerification> {
    findByUserId(id: string): Promise<lawyerVerificationDetails | null>;
    update(payload: Partial<LawyerVerification>): Promise<LawyerVerification | null>;
}
