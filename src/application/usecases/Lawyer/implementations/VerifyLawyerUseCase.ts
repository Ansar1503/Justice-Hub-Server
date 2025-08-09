import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IVerifyLawyerUseCase } from "../IVerifyLawyerUseCase";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
// import { LawyerVerificationDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import { Lawyer } from "@domain/entities/Lawyer";
import {
  LawyerVerificationInputDto,
  LawyerOutputDto,
} from "@src/application/dtos/Lawyer/VerifyLawyerDto";

export class VerifyLawyerUseCase implements IVerifyLawyerUseCase {
  constructor(
    private userRepo: IUserRepository,
    private lawyerRepo: ILawyerRepository,
    private lawyerDocumentRepo: ILawyerDocumentsRepository
  ) {}
  async execute(input: LawyerVerificationInputDto): Promise<LawyerOutputDto> {
    // console.log("lawyer verification input :: ", input);
    const userDetails = await this.userRepo.findByuser_id(input.user_id);
    if (!userDetails) {
      throw new Error("USER_NOT_FOUND");
    }
    if (userDetails.role !== "lawyer") {
      throw new Error("USER_NOT_LAWYER");
    }
    if (userDetails.is_blocked) {
      throw new Error("USER_BLOCKED");
    }
    const document = await this.lawyerDocumentRepo.find(userDetails.user_id);
    const lawyerVerficationData = await this.lawyerRepo.findUserId(
      userDetails.user_id
    );
    if (!lawyerVerficationData) throw new Error("lawyer not found");
    if (lawyerVerficationData?.verification_status === "verified") {
      throw new Error("lawyer already verified");
    }
    if (lawyerVerficationData.verification_status === "requested") {
      throw new Error(
        "lawyer verification is requested please wait till admin appromve"
      );
    }
    const DocumentsPayload = LawyerDocuments.create({
      user_id: input.user_id,
      bar_council_certificate: input.documents.bar_council_certificate,
      certificate_of_practice: input.documents.certificate_of_practice,
      enrollment_certificate: input.documents.enrollment_certificate,
    });
    if (document) {
      document.update({
        bar_council_certificate: input.documents.bar_council_certificate,
        certificate_of_practice: input.documents.certificate_of_practice,
        enrollment_certificate: input.documents.enrollment_certificate,
      });
    }
    const newDocument = await this.lawyerDocumentRepo.create(
      document || DocumentsPayload
    );

    lawyerVerficationData?.update({
      barcouncil_number: input.barcouncil_number,
      certificate_of_practice_number: input.certificate_of_practice_number,
      consultation_fee: input.consultation_fee,
      description: input.description,
      documents: newDocument.id,
      enrollment_certificate_number: input.enrollment_certificate_number,
      experience: input.experience,
      practice_areas: input.practice_areas,
      specialisation: input.specialisation,
    });
    lawyerVerficationData?.requestVerification();

    const lawyerData = await this.lawyerRepo.update(lawyerVerficationData);
    if (!lawyerData) {
      throw new Error("lawyer Data not found");
    }
    return {
      id: lawyerData.id,
      user_id: lawyerData.user_id,
      barcouncil_number: lawyerData.barcouncil_number,
      certificate_of_practice_number: lawyerData.certificate_of_practice_number,
      enrollment_certificate_number: lawyerData.certificate_of_practice_number,
      experience: lawyerData.experience,
      consultation_fee: lawyerData.consultation_fee,
      description: lawyerData.description,
      practice_areas: lawyerData.practice_areas,
      rejectReason: lawyerData.rejectReason,
      createdAt: lawyerData.createdAt,
      documents: newDocument,
      specialisation: lawyerData.specialisation,
      verification_status: lawyerData.verification_status,
      updatedAt: lawyerData.updatedAt,
    };
  }
}
