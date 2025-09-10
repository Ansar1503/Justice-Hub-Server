import { ILawyerVerificationRepo } from "@domain/IRepository/ILawyerVerificationRepo";
import { BaseRepository } from "./base/BaseRepo";
import { LawyerVerification } from "@domain/entities/LawyerVerification";
import LawyerVerificaitionModel, {
  ILawyerVerificationModel,
} from "../model/LawyerVerificaitionModel";
import { IMapper } from "@infrastructure/Mapper/IMapper";
import { ClientSession } from "mongoose";

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
  async findByUserId(id: string): Promise<LawyerVerification | null> {
    const data = await this.model.findOne(
      { userId: id },
      {},
      { session: this.session }
    );
    return data ? this.mapper.toDomain(data) : null;
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
