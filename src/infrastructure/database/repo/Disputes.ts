import { Disputes } from "../../../domain/entities/Disputes";
import { IDisputes } from "../../../domain/I_repository/IDisputes";
import { DisputesModel } from "../model/Disputes";

export class DisputesRepo implements IDisputes {
  async create(payload: Disputes): Promise<Disputes> {
    const disputes = (await DisputesModel.create(payload)).toObject();
    return { ...disputes, contentId: disputes.contentId.toString() };
  }
  async findByContentId(payload: { contentId: string; }): Promise<Disputes | null> {
      const disputes = await DisputesModel.findOne({ contentId: payload.contentId });
      return disputes ? { ...disputes, contentId: disputes.contentId.toString() } : null;
  }
}
