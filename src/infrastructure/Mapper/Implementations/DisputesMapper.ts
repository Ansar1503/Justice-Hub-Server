import { Disputes } from "@domain/entities/Disputes";
import { IMapper } from "../IMapper";
import { IDisputesModel } from "@infrastructure/database/model/DisputesModel";
import { Types } from "mongoose";

export class DisputesMapper implements IMapper<Disputes, IDisputesModel> {
  toDomain(persistence: IDisputesModel): Disputes {
    return Disputes.fromPersistence({
      id: persistence._id,
      contentId: persistence.contentId.toString(),
      disputeType: persistence.disputeType,
      reason: persistence.reason,
      reportedBy: persistence.reportedBy,
      reportedUser: persistence.reportedUser,
      status: persistence.status,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    });
  }
  toDomainArray(persistence: IDisputesModel[]): Disputes[] {
    return persistence.map((p) => this.toDomain(p));
  }
  toPersistence(entity: Disputes): Partial<IDisputesModel> {
    return {
      _id: entity.id,
      disputeType: entity.disputeType,
      contentId: new Types.ObjectId(entity.contentId),
      reason: entity.reason,
      reportedBy: entity.reportedBy,
      reportedUser: entity.reportedUser,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
