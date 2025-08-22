import { LawyerOutputDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { IFetchLawyerDataUseCase } from "../IFetchLawyerDataUseCase";
import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";

export class FetchLawyerDataUseCase implements IFetchLawyerDataUseCase {
  constructor(
    private userRepo: IUserRepository,
    private lawyerRepo: ILawyerRepository,
    private lawyerDocRepo: ILawyerDocumentsRepository
  ) {}
  async execute(input: string): Promise<LawyerOutputDto> {
    const userDetails = await this.userRepo.findByuser_id(input);

    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("UNAUTHORIZED");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const lawyerDetails = await this.lawyerRepo.findUserId(input);
    if (!lawyerDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    const lawyerDocs = await this.lawyerDocRepo.find(userDetails.user_id);
    if (!lawyerDocs) {
      throw new Error("lawyerDocs not found");
    }
    return {
      id: lawyerDetails.id,
      barcouncil_number: lawyerDetails.barcouncil_number,
      certificate_of_practice_number:
        lawyerDetails.certificate_of_practice_number,
      consultation_fee: lawyerDetails.consultation_fee,
      description: lawyerDetails.description,
      documents: {
        bar_council_certificate: lawyerDocs.bar_council_certificate,
        certificate_of_practice: lawyerDocs.certificate_of_practice,
        enrollment_certificate: lawyerDocs.enrollment_certificate,
        id: lawyerDocs.id,
        createdAt: lawyerDocs.createdAt,
        updatedAt: lawyerDocs.updatedAt,
        user_id: lawyerDocs.user_id,
      },
      enrollment_certificate_number:
        lawyerDetails.enrollment_certificate_number,
      experience: lawyerDetails.experience,
      practice_areas: lawyerDetails.practice_areas,
      rejectReason: lawyerDetails.rejectReason,
      specialisation: lawyerDetails.specialisation,
      user_id: lawyerDetails.user_id,
      verification_status: lawyerDetails.verification_status,
      createdAt: lawyerDetails.createdAt,
      updatedAt: lawyerDetails.updatedAt,
    };
  }
}
