import { IVerifyLawyerUseCase } from "../IVerifyLawyerUseCase";
import { LawyerDocuments } from "@domain/entities/LawyerDocument";
import {
  LawyerVerificationInputDto,
  LawyerOutputDto,
} from "@src/application/dtos/Lawyer/VerifyLawyerDto";
import { Lawyer } from "@domain/entities/Lawyer";
import { LawyerVerification } from "@domain/entities/LawyerVerification";
import { IUnitofWork } from "@infrastructure/database/UnitofWork/IUnitofWork";

export class VerifyLawyerUseCase implements IVerifyLawyerUseCase {
  constructor(private _unitOfWork: IUnitofWork) {}

  async execute(input: LawyerVerificationInputDto): Promise<LawyerOutputDto> {
    return this._unitOfWork.startTransaction(async (uow) => {
      const userDetails = await uow.userRepo.findByuser_id(input.user_id);
      if (!userDetails) throw new Error("USER_NOT_FOUND");
      if (userDetails.role !== "lawyer") throw new Error("USER_NOT_LAWYER");
      if (userDetails.is_blocked) throw new Error("USER_BLOCKED");

      const document = await uow.lawyerDocumentsRepo.find(userDetails.user_id);
      const lawyerDetails = await uow.lawyerRepo.findUserId(
        userDetails.user_id
      );
      const lawyerVerificationDetails =
        await uow.lawyerVerificationRepo.findByUserId(userDetails.user_id);

      if (lawyerVerificationDetails?.verificationStatus === "verified") {
        throw new Error("LAWYER_ALREADY_VERIFIED");
      }
      if (lawyerVerificationDetails?.verificationStatus === "requested") {
        throw new Error("VERIFICATION_ALREADY_REQUESTED");
      }

      if (!lawyerDetails) {
        const lawyerPayload = Lawyer.create({
          consultationFee: input.consultation_fee,
          description: input.description,
          experience: input.experience,
          practiceAreas: input.practice_areas,
          specializations: input.specialisation,
          userId: input.user_id,
        });
        await uow.lawyerRepo.create(lawyerPayload);
      } else {
        lawyerDetails.update({
          consultationFee: input.consultation_fee,
          description: input.description,
          experience: input.experience,
          practiceAreas: input.practice_areas,
          specializations: input.specialisation,
          updatedAt: new Date(),
        });
        await uow.lawyerRepo.update(lawyerDetails);
      }

      let newDocument: LawyerDocuments;
      if (document) {
        document.update({
          barCouncilCertificate: input.documents.bar_council_certificate,
          certificateOfPractice: input.documents.certificate_of_practice,
          enrollmentCertificate: input.documents.enrollment_certificate,
        });
        newDocument = await uow.lawyerDocumentsRepo.create(document);
      } else {
        const documentsPayload = LawyerDocuments.create({
          userId: input.user_id,
          barCouncilCertificate: input.documents.bar_council_certificate,
          certificateOfPractice: input.documents.certificate_of_practice,
          enrollmentCertificate: input.documents.enrollment_certificate,
        });
        newDocument = await uow.lawyerDocumentsRepo.create(documentsPayload);
      }

      let lawyerData: LawyerVerification | null;
      if (!lawyerVerificationDetails) {
        const lawyerVerificationPayload = LawyerVerification.create({
          barCouncilNumber: input.barcouncil_number,
          certificateOfPracticeNumber: input.certificate_of_practice_number,
          documents: newDocument.id,
          enrollmentCertificateNumber: input.enrollment_certificate_number,
          userId: input.user_id,
          verificationStatus: "requested",
        });
        lawyerData = await uow.lawyerVerificationRepo.create(
          lawyerVerificationPayload
        );
      } else {
        lawyerVerificationDetails.update({
          barCouncilNumber: input.barcouncil_number,
          certificateOfPracticeNumber: input.certificate_of_practice_number,
          documents: newDocument.id,
          enrollmentCertificateNumber: input.enrollment_certificate_number,
          verificationStatus: "requested",
        });
        lawyerData = await uow.lawyerVerificationRepo.update(
          lawyerVerificationDetails
        );
      }
      if (!lawyerData) throw new Error("lawyer data update error");
      return {
        id: lawyerData.id,
        user_id: lawyerData.userId,
        barcouncil_number: lawyerData.barCouncilNumber,
        certificate_of_practice_number: lawyerData.certificateOfPracticeNumber,
        enrollment_certificate_number: lawyerData.enrollmentCertificateNumber,
        experience: input.experience,
        consultation_fee: input.consultation_fee,
        description: input.description,
        practice_areas: input.practice_areas,
        rejectReason: lawyerData.rejectReason || "",
        createdAt: lawyerData.createdAt,
        updatedAt: lawyerData.updatedAt,
        documents: newDocument,
        specialisation: input.specialisation,
        verification_status: lawyerData.verificationStatus,
      };
    });
  }
}
