import { IUserRepository } from "@domain/IRepository/IUserRepo";
import { IVerifyLawyerUseCase } from "../IVerifyLawyerUseCase";
import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { ILawyerDocumentsRepository } from "@domain/IRepository/ILawyerDocumentsRepo";
// import { LawyerVerificationDto } from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import {
  LawyerVerificationInputDto,
  LawyerOutputDto,
} from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";

export class VerifyLawyerUseCase implements IVerifyLawyerUseCase {
  constructor(
    private userRepo: IUserRepository,
    private lawyerRepo: ILawyerRepository,
    private lawyerDocumentRepo: ILawyerDocumentsRepository,
    private lawyerVerificationRepo: ILawyerVerificationRepo
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
    const lawyerDetails = await this.lawyerRepo.findUserId(userDetails.user_id);
    const lawyerVerificaitionDetails =
      await this.lawyerVerificationRepo.findByUserId(userDetails.user_id);
    if (!lawyerDetails) throw new Error("lawyer not found");
    if (!lawyerVerificaitionDetails) throw new Error("lawyer not found");
    if (lawyerVerificaitionDetails?.verificationStatus === "verified") {
      throw new Error("lawyer already verified");
    }
    if (lawyerVerificaitionDetails.verificationStatus === "requested") {
      throw new Error(
        "lawyer verification is requested please wait till admin appromve"
      );
    }
    const DocumentsPayload = LawyerDocuments.create({
      userId: input.user_id,
      barCouncilCertificate: input.documents.bar_council_certificate,
      certificateOfPractice: input.documents.certificate_of_practice,
      enrollmentCertificate: input.documents.enrollment_certificate,
    });
    if (document) {
      document.update({
        barCouncilCertificate: input.documents.bar_council_certificate,
        certificateOfPractice: input.documents.certificate_of_practice,
        enrollmentCertificate: input.documents.enrollment_certificate,
      });
    }
    const newDocument = await this.lawyerDocumentRepo.create(
      document || DocumentsPayload
    );

    lawyerVerificaitionDetails?.update({
      barCouncilNumber: input.barcouncil_number,
      certificateOfPracticeNumber: input.certificate_of_practice_number,
      documents: newDocument.id,
      enrollmentCertificateNumber: input.enrollment_certificate_number,
      verificationStatus: "requested",
    });

    const lawyerData = await this.lawyerVerificationRepo.update(
      lawyerVerificaitionDetails
    );
    if (!lawyerData) {
      throw new Error("lawyer Data not found");
    }
    return {
      id: lawyerData.id,
      user_id: lawyerData.userId,
      barcouncil_number: lawyerData.barCouncilNumber,
      certificate_of_practice_number: lawyerData.certificateOfPracticeNumber,
      enrollment_certificate_number: lawyerData.enrollmentCertificateNumber,
      experience: lawyerDetails.experience,
      consultation_fee: lawyerDetails.consultationFee,
      description: lawyerDetails.description,
      practice_areas: lawyerDetails.practiceAreas,
      rejectReason: lawyerData.rejectReason || "",
      createdAt: lawyerData.createdAt,
      documents: newDocument,
      specialisation: lawyerDetails.specializations,
      verification_status: lawyerVerificaitionDetails.verificationStatus,
      updatedAt: lawyerData.updatedAt,
    };
  }
}
