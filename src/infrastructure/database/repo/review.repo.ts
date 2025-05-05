import { Review } from "../../../domain/entities/Review.entity";
import { IreviewRepo } from "../../../domain/I_repository/I_review.repo";
import reviewModel from "../model/review.model";

export class ReviewRepo implements IreviewRepo {
  async create(payload: Review): Promise<void> {
    await reviewModel.create(payload);
  }
  async update(payload: Review): Promise<void> {
    return {} as any;
  }
  async fetchAll(): Promise<Review[] | []> {
    return [] as any;
  }
  async delete(id: string): Promise<void> {}
}
