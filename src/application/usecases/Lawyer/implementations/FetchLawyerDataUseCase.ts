import { LawyerOutputDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { IFetchLawyerDataUseCase } from "../IFetchLawyerDataUseCase";

export class FetchLawyerDataUseCase implements IFetchLawyerDataUseCase {
    constructor(
        private _userRepo: IUserRepository,
        private _lawyerRepo: ILawyerRepository,
        private _lawyerDocRepo: ILawyerDocumentsRepository,
        private _lawyerVerificationRepo: ILawyerVerificationRepo,
    ) {}
    async execute(input: string): Promise<LawyerOutputDto> {
        const userDetails = await this._userRepo.findByuser_id(input);

        if (!userDetails) {
            throw new Error("USER_NOT_FOUND");
        }
        if (userDetails.role !== "lawyer") {
            throw new Error("UNAUTHORIZED");
        }
        if (userDetails.is_blocked) {
            throw new Error("USER_BLOCKED");
        }
        const lawyerDetails = await this._lawyerRepo.findUserId(input);
        if (!lawyerDetails) {
            throw new Error("USER_NOT_FOUND");
        }
        const lawyerVerificaitionDetails = await this._lawyerVerificationRepo.findByUserId(userDetails.user_id);
        if (!lawyerVerificaitionDetails) throw new Error("Lawyer verification details not foumd");
        const lawyerDocs = await this._lawyerDocRepo.find(userDetails.user_id);
        if (!lawyerDocs) {
            throw new Error("lawyerDocs not found");
        }
        return {
            id: lawyerDetails.id,
            barcouncil_number: lawyerVerificaitionDetails.barCouncilNumber,
            certificate_of_practice_number: lawyerVerificaitionDetails.certificateOfPracticeNumber,
            consultation_fee: lawyerDetails.consultationFee,
            description: lawyerDetails.description,
            documents: {
                barCouncilCertificate: lawyerDocs.barCouncilCertificate,
                certificateOfPractice: lawyerDocs.certificateOfPractice,
                enrollmentCertificate: lawyerDocs.enrollmentCertificate,
                id: lawyerDocs.id,
                createdAt: lawyerDocs.createdAt,
                updatedAt: lawyerDocs.updatedAt,
                userId: lawyerDocs.userId,
            },
            enrollment_certificate_number: lawyerVerificaitionDetails.enrollmentCertificateNumber,
            experience: lawyerDetails.experience,
            practice_areas: lawyerDetails.practiceAreas?.map((p) => p?.id),
            rejectReason: lawyerVerificaitionDetails.rejectReason || "",
            specialisation: lawyerDetails.specializations?.map((s) => s?.id),
            user_id: lawyerDetails.userId,
            verification_status: lawyerVerificaitionDetails.verificationStatus,
            createdAt: lawyerDetails.createdAt,
            updatedAt: lawyerDetails.updatedAt,
        };
    }
}
