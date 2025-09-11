import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { BaseRepository } from "./base/BaseRepo";
import { LawyerVerification } from "@domain/entities/LawyerVerification";
import LawyerVerificaitionModel, {
  ILawyerVerificationModel,
} from "../model/LawyerVerificaitionModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";
import { lawyerVerificationDetails } from "@src/application/dtos/Lawyer/LawyerVerificationDetailsDto";
import { ILawyerDocumentsModel } from "../model/LawyerDocumentsModel";

export class LawyerVerificationRepo
  extends BaseRepository<LawyerVerification, ILawyerVerificationModel>
  implements ILawyerVerificationRepo
{
  constructor(
    mapper: IMapper<LawyerVerification, ILawyerVerificationModel>,
    session?: ClientSession
  ) {
    super(LawyerVerificaitionModel, mapper, session);
  }
  async findByUserId(id: string): Promise<lawyerVerificationDetails | null> {
    const data = await this.model
      .findOne({ userId: id }, {}, { session: this.session })
      .populate<{ documents: ILawyerDocumentsModel }>("documents");
    if (!data) return null;
    return {
      barCouncilNumber: data.barCouncilNumber,
      certificateOfPracticeNumber: data.certificateOfPracticeNumber,
      createdAt: data.createdAt,
      documents: {
        barCouncilCertificate: data.documents?.barCouncilCertificate,
        certificateOfPractice: data?.documents?.certificateOfPractice,
        enrollmentCertificate: data?.documents?.enrollmentCertificate,
        id: data?.documents?._id,
        userId: data?.documents?.userId,
      },
      enrollmentCertificateNumber: data.enrollmentCertificateNumber,
      id: data._id,
      updatedAt: data.updatedAt,
      userId: data?.userId,
      verificationStatus: data.verificationStatus,
      rejectReason: data.rejectReason,
    };
  }
  async update(
    payload: Partial<LawyerVerification>
  ): Promise<LawyerVerification | null> {
    const update: Record<string, any> = {};

    if (payload.barCouncilNumber?.trim()) {
      update["barCouncilNumber"] = payload.barCouncilNumber;
    }
    if (payload.certificateOfPracticeNumber?.trim()) {
      update["certificateOfPracticeNumber"] =
        payload.certificateOfPracticeNumber;
    }
    if (payload.enrollmentCertificateNumber?.trim()) {
      update["enrollmentCertificateNumber"] =
        payload.enrollmentCertificateNumber;
    }
    if (payload.documents?.trim()) {
      update["documents"] = payload.documents;
    }
    if (payload.verificationStatus) {
      update["verificationStatus"] = payload.verificationStatus;
    }
    if (payload.rejectReason !== undefined) {
      update["rejectReason"] = payload.rejectReason;
    }

    update["updatedAt"] = new Date();

    const updated = await this.model.findByIdAndUpdate(payload.id, update, {
      new: true,
      session: this.session,
    });

    if (!updated) {
      return null;
    }

    return this.mapper.toDomain(updated);
  }
}
