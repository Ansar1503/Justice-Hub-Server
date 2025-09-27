import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { lawyerVerificationDetails } from "@src/application/dtos/Lawyer/LawyerVerificationDetailsDto";
import { IFetchLawyerVerificationDetailsUsecase } from "../IFetchLawyerVerificatoinDetails";

export class FetchLawyerVerificationDetailsUsecase implements IFetchLawyerVerificationDetailsUsecase {
    constructor(private _lawyerverificationRepo: ILawyerVerificationRepo) {}
    async execute(input: string): Promise<lawyerVerificationDetails> {
        const verificationData = await this._lawyerverificationRepo.findByUserId(input);
        if (!verificationData) throw new Error("verification data not found");
        return verificationData;
    }
}
