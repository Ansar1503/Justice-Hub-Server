import { Review } from "../../../domain/entities/Review.entity";
import { IreviewRepo } from "../../../domain/I_repository/I_review.repo";
import reviewModel from "../model/review.model";

export class ReviewRepo implements IreviewRepo {
  async create(payload: Review): Promise<Review> {
    const review = await reviewModel.create(payload);
    return review;
  }
  async update(payload: Partial<Review>): Promise<Review> {
    return {} as any;
  }
  async findBySession_id(session_id: string): Promise<Review | null> {
    return await reviewModel.findOne({ session_id }).exec();
  }
  async findByLawyer_id(lawyer_id: string): Promise<Review[] | []> {
    return await reviewModel.find({ lawyer_id }).exec();
  }
  async delete(id: string): Promise<Review> {
    return {} as any;
  }
}
